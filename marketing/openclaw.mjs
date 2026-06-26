// GiantBiteAI content engine — drafts one blog article + platform-adapted social posts per run.
// DRAFT ONLY: writes markdown to marketing/drafts/, never posts anywhere on its own.
// Run daily via the OS scheduler or Claude Code's `schedule` skill: `node marketing/openclaw.mjs`
import "dotenv/config";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { chatJSON } from "../server/gemini.mjs";
import { pickTodaysPillar, seasonalHint } from "./topics.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const ARTICLE_SYSTEM = `You are the content writer for GiantBiteAI, an AI cooking app (Recipe Generator, Meal Planner, AI Cooking Coach) with a generous free tier.
Write a genuinely useful, specific blog post a real home cook would bookmark — not generic AI filler. Include real technique detail, not just "cook until done."
Naturally mention GiantBiteAI's relevant free tool once, briefly, where it actually helps — never more than once, never salesy. Never name or imply which AI model/provider powers the app.
Respond with ONLY a JSON object: {"title": string, "metaDescription": string, "targetKeyword": string, "bodyMarkdown": string}
bodyMarkdown should be 500-800 words, with an H1, a few H2s, and a short FAQ section (2-3 Q&As) since FAQ schema helps long-tail search.`;

const SOCIAL_SYSTEM = `You repurpose a blog article into platform-native drafts for GiantBiteAI, an AI cooking app with a generous free tier. Each draft must read as genuinely useful content first — promotion is secondary and light. Never name or imply which AI model/provider powers the app.
Respond with ONLY a JSON object matching this shape:
{
  "redditPosts": [{"subreddit": string, "title": string, "body": string}],
  "pinterest": {"title": string, "description": string},
  "twitterThread": string[],
  "tiktokScript": string[],
  "facebookGroupPost": string
}
Reddit posts must be value-first (the recipe/tip itself) with at most one soft, non-pushy mention of GiantBiteAI near the end — most cooking subreddits ban direct self-promotion, so write like a community member sharing something useful, not an ad.
tiktokScript is a numbered list of short on-screen text/voiceover beats (8-12 beats) for a 30-45 second video, no production jargon.`;

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

function saveDraft(date, pillar, article, social) {
  const dir = join(__dirname, "drafts");
  mkdirSync(dir, { recursive: true });
  const stamp = date.toISOString().slice(0, 10);
  const path = join(dir, `${stamp}-${pillar.id}.md`);

  const reddit = social.redditPosts
    .map((p) => `#### r/${p.subreddit} — ${p.title}\n\n${p.body}\n`)
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

### Reddit

${reddit}

### Pinterest

**${social.pinterest.title}**
${social.pinterest.description}

### X / Twitter thread

${social.twitterThread.map((t, i) => `${i + 1}. ${t}`).join("\n")}

### TikTok script (30-45s)

${social.tiktokScript.map((t, i) => `${i + 1}. ${t}`).join("\n")}

### Facebook group post

${social.facebookGroupPost}
`;

  writeFileSync(path, content, "utf8");
  return path;
}

async function main() {
  const date = new Date();
  const pillar = pickTodaysPillar(date);
  const hint = seasonalHint(date);

  console.log(`[openclaw] Today's pillar: ${pillar.id} — ${pillar.angle}`);
  const article = await generateArticle(pillar, hint);
  console.log(`[openclaw] Article drafted: "${article.title}"`);
  const social = await generateSocialAdaptations(article, pillar);
  const path = saveDraft(date, pillar, article, social);

  console.log(`[openclaw] Draft saved to ${path}`);
  console.log("[openclaw] DRAFT ONLY — review and post manually. Nothing was published.");
}

main().catch((err) => {
  console.error("[openclaw] Failed:", err.message);
  process.exit(1);
});
