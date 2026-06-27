// GiantBiteAI content engine — drafts one blog article + platform-adapted social posts per run.
// DRAFT ONLY: writes markdown to marketing/drafts/, never posts anywhere on its own.
// Run daily via the OS scheduler or Claude Code's `schedule` skill: `node marketing/openclaw.mjs`
import "dotenv/config";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { chatJSON } from "../server/ai.mjs";
import { pickTodaysPillar, seasonalHint } from "./topics.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const ARTICLE_SYSTEM = `You are the content writer for GiantBiteAI, an AI cooking app (Recipe Generator, Meal Planner, AI Cooking Coach) with a generous free tier.
Write a genuinely useful, specific blog post a real home cook would bookmark — not generic AI filler. Include real technique detail, not just "cook until done."
Naturally mention GiantBiteAI's relevant free tool once, briefly, where it actually helps — never more than once, never salesy. Never name or imply which AI model/provider powers the app.
Respond with ONLY a JSON object: {"title": string, "metaDescription": string, "targetKeyword": string, "bodyMarkdown": string}
bodyMarkdown should be 500-800 words, with an H1, a few H2s, and a short FAQ section (2-3 Q&As) since FAQ schema helps long-tail search.`;

const SOCIAL_SYSTEM = `You repurpose a blog article into platform-native drafts for GiantBiteAI, an AI cooking app with a generous free tier. Each draft must read as genuinely useful content first — promotion is secondary and light. Never name or imply which AI model/provider powers the app.

GiantBiteAI's primary paying audience is 55+ (it's also for everyone, but 55+ converts best). For this audience, Facebook groups are the lead channel — 72% of 50+ adults are active there, well ahead of TikTok for this age group. Write the Facebook drafts with that priority and care: warm, plain language, no slang or jargon, no assumption of tech familiarity. TikTok/Pinterest/X are secondary/growth channels for a younger audience, not the primary target.

Respond with ONLY a JSON object matching this shape:
{
  "redditPosts": [{"subreddit": string, "title": string, "body": string}],
  "pinterest": {"title": string, "description": string},
  "twitterThread": string[],
  "tiktokScript": string[],
  "facebookGroupPosts": [{"groupType": string, "post": string}]
}
Reddit posts must be value-first (the recipe/tip itself) with at most one soft, non-pushy mention of GiantBiteAI near the end — most cooking subreddits ban direct self-promotion, so write like a community member sharing something useful, not an ad.
tiktokScript is a numbered list of short on-screen text/voiceover beats (8-12 beats) for a 30-45 second video, no production jargon.
facebookGroupPosts should have 2 variations targeting different group types (e.g. a budget/frugal-living group and a senior/retiree-focused or general home-cooking group) — these matter more than the other channels, write them with the same care as the blog article itself.`;

const AD_PLAN_SYSTEM = `You are a paid-acquisition strategist for GiantBiteAI, an AI cooking app (Recipe Generator, Meal Planner, AI Cooking Coach, freemium pricing). Never name or imply which AI model/provider powers the app.
GiantBiteAI's primary paying audience is 55+ (also appeals broadly, but 55+ converts best). Design a small-budget test-and-narrow funnel: 3 distinct creative angles per platform, each meant to run at a $50 test budget, so the weakest 2 can be killed and spend reallocated to the winner.
Respond with ONLY a JSON object matching this shape:
{
  "facebookAds": [{"angle": string, "headline": string, "primaryText": string, "cta": string, "targeting": string}],
  "tiktokAds": [{"angle": string, "hook": string, "scriptBeats": string[], "cta": string, "targeting": string}],
  "testPlan": string
}
Exactly 3 entries in facebookAds and 3 in tiktokAds, each a genuinely different angle (e.g. pain-point/waste-saving, social proof/ease, curiosity/feature demo) — not minor rewordings of each other.
testPlan should be 3-4 sentences explaining how to run all 6 ads at $50 each, what signal to watch (CTR, cost per trial signup) over what timeframe, and how to decide which single ad to scale.`;

async function generateArticle(pillar, seasonHint) {
  const messages = [
    { role: "system", content: ARTICLE_SYSTEM },
    {
      role: "user",
      content: `Today's content angle: "${pillar.angle}"\nTarget SEO intent: ${pillar.seo}\nSeasonal context: ${seasonHint}\nRelevant free-tool mention: ${pillar.cta}`,
    },
  ];
  return chatJSON({ model: MODEL, messages, temperature: 0.8 });
}

async function generateSocialAdaptations(article, pillar) {
  const messages = [
    { role: "system", content: SOCIAL_SYSTEM },
    {
      role: "user",
      content: `Blog article:\nTitle: ${article.title}\n${article.bodyMarkdown}\n\nSuggested subreddits to adapt for: ${pillar.subreddits.join(", ")}\nFree-tool mention to weave in lightly: ${pillar.cta}`,
    },
  ];
  return chatJSON({ model: MODEL, messages, temperature: 0.8 });
}

async function generateAdPlan(article, pillar) {
  const messages = [
    { role: "system", content: AD_PLAN_SYSTEM },
    {
      role: "user",
      content: `This week's content angle: "${pillar.angle}"\nBlog article title for context: ${article.title}\nFree-tool hook to weave in where relevant: ${pillar.cta}`,
    },
  ];
  return chatJSON({ model: MODEL, messages, temperature: 0.8 });
}

function saveDraft(date, pillar, article, social, adPlan) {
  const dir = join(__dirname, "drafts");
  mkdirSync(dir, { recursive: true });
  const stamp = date.toISOString().slice(0, 10);
  const path = join(dir, `${stamp}-${pillar.id}.md`);

  const reddit = social.redditPosts
    .map((p) => `#### r/${p.subreddit} — ${p.title}\n\n${p.body}\n`)
    .join("\n");

  const facebook = social.facebookGroupPosts
    .map((p) => `#### ${p.groupType}\n\n${p.post}\n`)
    .join("\n");

  const content = `# ${stamp} — ${pillar.id}

> **DRAFT ONLY — not posted anywhere.** Review every section before sharing. Most cooking subreddits restrict or ban self-promotion links — check each subreddit's rules (and your account's karma/age requirements) before posting there.

## Blog article

**Title:** ${article.title}
**Meta description:** ${article.metaDescription}
**Target keyword:** ${article.targetKeyword}

${article.bodyMarkdown}

---

## Social adaptations

### Facebook groups (lead channel — primary 55+ audience)

${facebook}

### Reddit

${reddit}

### Pinterest

**${social.pinterest.title}**
${social.pinterest.description}

### X / Twitter thread

${social.twitterThread.map((t, i) => `${i + 1}. ${t}`).join("\n")}

### TikTok script (30-45s)

${social.tiktokScript.map((t, i) => `${i + 1}. ${t}`).join("\n")}

---

## Paid ad test plan — DRAFT ONLY, no spend authorized

> Pick one day's plan to actually run — don't launch a new set of variants every day. These are concepts for you to review, adjust, and load into Ads Manager/TikTok Ads yourself.

### Facebook ($50/day per variant)

${adPlan.facebookAds.map((a, i) => `**Variant ${i + 1} — ${a.angle}**\nHeadline: ${a.headline}\nPrimary text: ${a.primaryText}\nCTA: ${a.cta}\nTargeting: ${a.targeting}\n`).join("\n")}

### TikTok ($50/day per variant)

${adPlan.tiktokAds.map((a, i) => `**Variant ${i + 1} — ${a.angle}**\nHook: ${a.hook}\nScript:\n${a.scriptBeats.map((b, j) => `${j + 1}. ${b}`).join("\n")}\nCTA: ${a.cta}\nTargeting: ${a.targeting}\n`).join("\n")}

### How to narrow down

${adPlan.testPlan}
`;

  writeFileSync(path, content, "utf8");
  return path;
}

// AI JSON output occasionally fails (malformed JSON, transient 5xx) — one retry covers
// almost all of these since they're not deterministic failures.
async function withRetry(fn, attempts = 2) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      console.warn(`[openclaw] attempt ${i + 1} failed: ${err.message} — retrying...`);
    }
  }
  throw lastErr;
}

async function main() {
  const date = new Date();
  const pillar = pickTodaysPillar(date);
  const hint = seasonalHint(date);

  console.log(`[openclaw] Today's pillar: ${pillar.id} — ${pillar.angle}`);
  const article = await withRetry(() => generateArticle(pillar, hint));
  console.log(`[openclaw] Article drafted: "${article.title}"`);
  const social = await withRetry(() => generateSocialAdaptations(article, pillar));
  console.log("[openclaw] Social adaptations drafted");
  const adPlan = await withRetry(() => generateAdPlan(article, pillar));
  console.log("[openclaw] Paid ad test plan drafted");
  const path = saveDraft(date, pillar, article, social, adPlan);

  console.log(`[openclaw] Draft saved to ${path}`);
  console.log("[openclaw] DRAFT ONLY — review and post manually, and no ad spend has been made. Nothing was published or paid for.");
}

main().catch((err) => {
  console.error("[openclaw] Failed:", err.message);
  process.exit(1);
});
