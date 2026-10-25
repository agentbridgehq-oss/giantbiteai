// Locks down the AI proxy endpoints: kill switch, signed-token auth, rate limits.
import crypto from "node:crypto";
import rateLimit from "express-rate-limit";

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function secret() {
  const s = process.env.AI_AUTH_SECRET;
  return s && s.length >= 32 ? s : null;
}

function b64url(buf) {
  return Buffer.from(buf).toString("base64url");
}

// Issue a signed token tied to a verified (paid) Stripe checkout email.
export function issueAiToken({ email, plan }) {
  const s = secret();
  if (!s || !email) return null;
  const payload = b64url(JSON.stringify({ sub: String(email).toLowerCase(), plan: plan || "pro", exp: Date.now() + TOKEN_TTL_MS }));
  const sig = b64url(crypto.createHmac("sha256", s).update(payload).digest());
  return `${payload}.${sig}`;
}

export function verifyAiToken(token) {
  const s = secret();
  if (!s || typeof token !== "string" || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = b64url(crypto.createHmac("sha256", s).update(payload).digest());
  const a = Buffer.from(sig || "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!data.sub || !data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export function aiKillSwitch(_req, res, next) {
  if (String(process.env.AI_ENDPOINTS_ENABLED ?? "true").toLowerCase() === "false") {
    return res.status(503).json({ error: "AI features are temporarily unavailable." });
  }
  next();
}

const json429 = (_req, res) => res.status(429).json({ error: "Too many requests — slow down and try again later." });

// Per-IP limits apply BEFORE auth so unauthenticated floods are also throttled.
export const aiIpLimiter = rateLimit({ windowMs: 60_000, limit: 10, standardHeaders: true, legacyHeaders: false, handler: json429 });
export const aiIpDailyLimiter = rateLimit({ windowMs: 86_400_000, limit: 200, standardHeaders: true, legacyHeaders: false, handler: json429 });

export function requireAiAuth(req, res, next) {
  const h = req.get("authorization") || "";
  const token = h.startsWith("Bearer ") ? h.slice(7).trim() : req.get("x-ai-token");
  const user = verifyAiToken(token);
  if (!user) return res.status(401).json({ error: "Sign in with a GiantBite plan to use AI features." });
  req.aiUser = user;
  next();
}

const userKey = (req) => `u:${req.aiUser?.sub || req.ip}`;
export const aiUserLimiter = rateLimit({ windowMs: 60_000, limit: 10, keyGenerator: userKey, standardHeaders: true, legacyHeaders: false, handler: json429 });
export const aiUserDailyLimiter = rateLimit({ windowMs: 86_400_000, limit: 100, keyGenerator: userKey, standardHeaders: true, legacyHeaders: false, handler: json429 });

export const aiGuard = [aiKillSwitch, aiIpLimiter, aiIpDailyLimiter, requireAiAuth, aiUserLimiter, aiUserDailyLimiter];
