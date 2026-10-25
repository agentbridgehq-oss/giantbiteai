// Guards for the public (non-AI) POST endpoints: /api/checkout and /api/capture-email.
import rateLimit from "express-rate-limit";

const json429 = (_req, res) => res.status(429).json({ error: "Too many requests — try again later." });
const mk = (windowMs, limit, prefix) =>
  rateLimit({ windowMs, limit, standardHeaders: true, legacyHeaders: false, handler: json429, keyGenerator: (req) => `${prefix}:${req.ip}` });

export const EMAIL_RE = /^[^\s@<>"',;]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$/;
export const ALLOWED_PLANS = new Set(["regular", "pro"]);

export function requireAllowedOrigin(allowed) {
  return (req, res, next) => {
    const origin = req.get("origin");
    if (!origin || !allowed.includes(origin)) return res.status(403).json({ error: "Forbidden origin" });
    next();
  };
}

export function validateCheckout(req, res, next) {
  const { plan = "pro", email } = req.body || {};
  if (typeof plan !== "string" || !ALLOWED_PLANS.has(plan)) return res.status(400).json({ error: "Unknown plan" });
  if (email !== undefined && email !== "" && (typeof email !== "string" || !EMAIL_RE.test(email.trim()))) {
    return res.status(400).json({ error: "Invalid email" });
  }
  next();
}

const EMAIL_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const lastSent = new Map();
export function _resetEmailCooldown() { lastSent.clear(); }

export function validateCaptureEmail(req, res, next) {
  const { email, name, website } = req.body || {};
  // Honeypot: real UI never fills "website"; bots do. Pretend success, send nothing.
  if (website) return res.json({ ok: true, welcomeSent: false });
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) return res.status(400).json({ error: "Invalid email" });
  if (name !== undefined && (typeof name !== "string" || name.length > 80)) return res.status(400).json({ error: "Invalid name" });
  const key = email.trim().toLowerCase();
  const now = Date.now();
  const prev = lastSent.get(key);
  if (prev && now - prev < EMAIL_COOLDOWN_MS) return res.status(429).json({ error: "Already sent to this address recently." });
  lastSent.set(key, now);
  if (lastSent.size > 50000) lastSent.clear();
  next();
}

export const checkoutLimiters = [mk(60_000, 5, "co-m"), mk(86_400_000, 50, "co-d")];
export const captureLimiters = [mk(60_000, 5, "ce-m"), mk(86_400_000, 50, "ce-d")];
