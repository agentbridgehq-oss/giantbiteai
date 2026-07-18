/**
 * Motivation-psychology welcome email for GiantBiteAI signups / paid upgrades.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEADS_PATH = path.join(__dirname, "..", "data", "customer-leads.json");

function loadLeads() {
  try {
    return JSON.parse(fs.readFileSync(LEADS_PATH, "utf8"));
  } catch {
    return [];
  }
}

function saveLeads(rows) {
  fs.mkdirSync(path.dirname(LEADS_PATH), { recursive: true });
  fs.writeFileSync(LEADS_PATH, JSON.stringify(rows.slice(0, 10000), null, 2));
}

export async function sendWelcomeEmail({ email, plan = "free", name }) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "invalid email" };
  }
  const normalized = email.trim().toLowerCase();
  const leads = loadLeads();
  const existing = leads.find((l) => l.email === normalized);
  if (existing?.welcomeSent) {
    return { ok: true, duplicate: true, welcomeSent: false };
  }

  const first = (name || "").trim().split(/\s+/)[0] || "there";
  const subject = `${first !== "there" ? first + ", y" : "Y"}ou're cooking smarter starting today — Day 1`;
  const text = `Hey ${first},

You just chose GiantBiteAI. That means you're the kind of person who feeds themselves well without burning the evening — not someone stuck between takeout guilt and empty fridge panic.

DAY-1 MICRO-WIN (do this in 5 minutes):
→ Open GiantBiteAI → generate one recipe from leftovers or a photo of what's in your fridge.

Why this works: autonomy (you chose better food systems), competence (one win beats a perfect meal plan you never start), progress (identity is what you cook today).

${plan && plan !== "free" ? `Your plan: ${plan}.` : "You're on Free — upgrade any time when the caps get in the way."}

Stuck? Reply to this email. A human reads it.

— GiantBiteAI

P.S. Reply "stop" anytime.`;

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;line-height:1.55">
  <p>Hey <strong>${first}</strong>,</p>
  <p>You just chose <strong>GiantBiteAI</strong>. You're the kind of person who feeds themselves well without burning the evening.</p>
  <div style="background:#0a0a0d;color:#e8e8ec;border-radius:12px;padding:16px;margin:18px 0">
    <div style="font-size:11px;letter-spacing:.12em;color:#fb923c;font-weight:700;margin-bottom:8px">DAY-1 MICRO-WIN</div>
    <p style="margin:0">Open GiantBiteAI → generate <strong>one recipe</strong> from leftovers or a fridge photo.</p>
  </div>
  <p style="font-size:14px;color:#555">Autonomy · competence · progress — one win beats a perfect plan you never start.</p>
  <p>— GiantBiteAI</p>
</div>`;

  let welcomeSent = false;
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "GiantBiteAI <onboarding@resend.dev>",
          to: [normalized],
          subject,
          text,
          html,
        }),
      });
      welcomeSent = res.ok;
      if (!res.ok) console.error("[welcome] resend failed", await res.text());
    } catch (e) {
      console.error("[welcome]", e.message);
    }
  }

  const row = {
    email: normalized,
    plan,
    name: name || null,
    capturedAt: existing?.capturedAt || new Date().toISOString(),
    welcomeSent: welcomeSent || existing?.welcomeSent || false,
  };
  if (existing) Object.assign(existing, row);
  else leads.unshift(row);
  saveLeads(leads);

  // Optional mirror to Central Command
  const cc = process.env.CENTRAL_COMMAND_URL;
  if (cc) {
    fetch(`${cc.replace(/\/$/, "")}/api/customers/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized, app: "giantbiteai", source: plan === "free" ? "signup" : "checkout", plan, name }),
    }).catch(() => {});
  }

  return { ok: true, welcomeSent, duplicate: !!existing };
}
