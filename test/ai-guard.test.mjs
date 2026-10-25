import { test, mock, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

process.env.AI_AUTH_SECRET = "x".repeat(48);
process.env.GEMINI_API_KEY = "test"; process.env.OPENROUTER_API_KEY = "test";
let providerCalls = 0;
const realFetch = globalThis.fetch;
globalThis.fetch = async (...a) => { providerCalls++; throw new Error("provider must not be called"); };

const { default: app } = await import("../server/index.mjs");
const { issueAiToken } = await import("../server/aiGuard.mjs");
const EPS = ["recipe", "import-recipe", "mealplan", "coach", "pairing", "nutrition"];

test("health still ok", async () => {
  const r = await request(app).get("/api/health");
  assert.equal(r.status, 200); assert.deepEqual(r.body, { ok: true });
});

test("unauthenticated AI calls get 401 and never reach provider", async () => {
  for (const ep of EPS) {
    const r = await request(app).post(`/api/${ep}`).set("X-Forwarded-For", `10.0.0.${EPS.indexOf(ep)}`).send({ dish: "x", food: "x", ingredientsText: "egg" });
    assert.equal(r.status, 401, ep);
  }
  const bad = await request(app).post("/api/pairing").set("X-Forwarded-For", "10.1.1.1").set("Authorization", "Bearer forged.sig").send({ dish: "x" });
  assert.equal(bad.status, 401);
  assert.equal(providerCalls, 0);
});

test("rapid calls hit 429 per IP", async () => {
  const codes = [];
  for (let i = 0; i < 12; i++) codes.push((await request(app).post("/api/mealplan").set("X-Forwarded-For", "10.2.2.2").send({})).status);
  assert.ok(codes.slice(0, 10).every((c) => c === 401));
  assert.equal(codes[11], 429);
  assert.equal(providerCalls, 0);
});

test("valid token passes auth (validation error, no provider call)", async () => {
  const t = issueAiToken({ email: "a@b.co", plan: "pro" });
  const r = await request(app).post("/api/pairing").set("X-Forwarded-For", "10.3.3.3").set("Authorization", `Bearer ${t}`).send({ dish: "" });
  assert.equal(r.status, 400);
  assert.equal(providerCalls, 0);
});

test("CORS rejects random origin, allows real one", async () => {
  const bad = await request(app).options("/api/pairing").set("Origin", "https://evil.example").set("Access-Control-Request-Method", "POST");
  assert.equal(bad.headers["access-control-allow-origin"], undefined);
  const ok = await request(app).options("/api/pairing").set("Origin", "https://giantbite-ai.netlify.app").set("Access-Control-Request-Method", "POST");
  assert.equal(ok.headers["access-control-allow-origin"], "https://giantbite-ai.netlify.app");
});

test("body size capped", async () => {
  const t = issueAiToken({ email: "c@d.co" });
  const r = await request(app).post("/api/pairing").set("X-Forwarded-For", "10.4.4.4").set("Content-Type", "application/json").send(JSON.stringify({ dish: "a".repeat(200_000) }));
  assert.equal(r.status, 413);
});

test("kill switch returns 503", async () => {
  process.env.AI_ENDPOINTS_ENABLED = "false";
  const r = await request(app).post("/api/coach").set("X-Forwarded-For", "10.5.5.5").send({});
  assert.equal(r.status, 503);
  delete process.env.AI_ENDPOINTS_ENABLED;
  assert.equal(providerCalls, 0);
});
