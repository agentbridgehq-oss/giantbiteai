import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
process.env.AI_AUTH_SECRET = "y".repeat(48);
delete process.env.STRIPE_SECRET_KEY; delete process.env.RESEND_API_KEY;
let outbound = 0;
globalThis.fetch = async () => { outbound++; throw new Error("no outbound"); };
const { default: app } = await import("../server/index.mjs");
const OK = "https://giantbite-ai.netlify.app";

test("checkout: bad origin 403, missing origin 403", async () => {
  assert.equal((await request(app).post("/api/checkout").set("X-Forwarded-For", "20.0.0.1").set("Origin", "https://evil.example").send({ plan: "pro" })).status, 403);
  assert.equal((await request(app).post("/api/checkout").set("X-Forwarded-For", "20.0.0.2").send({ plan: "pro" })).status, 403);
});
test("checkout: unknown plan / bad email 400; valid reaches stripe (503 unconfigured)", async () => {
  assert.equal((await request(app).post("/api/checkout").set("X-Forwarded-For", "20.0.0.3").set("Origin", OK).send({ plan: "price_evil" })).status, 400);
  assert.equal((await request(app).post("/api/checkout").set("X-Forwarded-For", "20.0.0.3").set("Origin", OK).send({ plan: "pro", email: "x<y>@z" })).status, 400);
  assert.equal((await request(app).post("/api/checkout").set("X-Forwarded-For", "20.0.0.3").set("Origin", OK).send({ plan: "regular", email: "a@b.co" })).status, 503);
});
test("checkout: 6th call/min from one IP is 429", async () => {
  const c = [];
  for (let i = 0; i < 6; i++) c.push((await request(app).post("/api/checkout").set("X-Forwarded-For", "20.0.0.9").set("Origin", OK).send({ plan: "bogus" })).status);
  assert.equal(c[5], 429);
});
test("checkout: body cap 413", async () => {
  const r = await request(app).post("/api/checkout").set("X-Forwarded-For", "20.0.1.1").set("Origin", OK).set("Content-Type", "application/json").send(JSON.stringify({ plan: "pro", pad: "a".repeat(10000) }));
  assert.equal(r.status, 413);
});
test("capture-email: origin, validation, honeypot, per-email cooldown, rate limit", async () => {
  assert.equal((await request(app).post("/api/capture-email").set("X-Forwarded-For", "30.0.0.1").set("Origin", "https://evil.example").send({ email: "v@x.co" })).status, 403);
  assert.equal((await request(app).post("/api/capture-email").set("X-Forwarded-For", "30.0.0.1").set("Origin", OK).send({ email: "nope" })).status, 400);
  const hp = await request(app).post("/api/capture-email").set("X-Forwarded-For", "30.0.0.1").set("Origin", OK).send({ email: "v@x.co", website: "spam" });
  assert.equal(hp.status, 200); assert.equal(hp.body.welcomeSent, false);
  assert.equal((await request(app).post("/api/capture-email").set("X-Forwarded-For", "30.0.0.2").set("Origin", OK).send({ email: "victim@x.co" })).status, 200);
  assert.equal((await request(app).post("/api/capture-email").set("X-Forwarded-For", "30.0.0.3").set("Origin", OK).send({ email: "VICTIM@x.co" })).status, 429);
  const c = [];
  for (let i = 0; i < 6; i++) c.push((await request(app).post("/api/capture-email").set("X-Forwarded-For", "30.0.0.4").set("Origin", OK).send({ email: "bad" })).status);
  assert.equal(c[5], 429);
});
