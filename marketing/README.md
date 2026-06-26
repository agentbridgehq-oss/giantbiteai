# GiantBiteAI content engine ("OpenClaw")

One script, draft-only, no autonomous posting — same boundary used for ClaudeCraft's marketing automation: drafting and reporting, never publishing on its own.

## What it does

`node marketing/openclaw.mjs` picks today's content angle from a researched rotation of pillars (`topics.mjs`), then:

1. Drafts a ~500-800 word blog article (with an FAQ block for long-tail/voice search) on DeepSeek-R1.
2. Adapts that article into platform-native drafts: Reddit posts (for specific subreddits), a Pinterest pin, an X/Twitter thread, a TikTok script outline, and a Facebook group post.
3. Saves everything as one markdown file in `marketing/drafts/YYYY-MM-DD-<pillar>.md`.

It never posts, schedules, or publishes anything — every draft needs a human read-through before it goes anywhere.

## Why these angles, why these platforms

Researched the food/recipe content space before picking pillars (see `topics.mjs` for sourcing notes):

- **Waste/budget content converts hardest in this niche** — r/EatCheapAndHealthy (~2.4M members) and r/budgetfood are both built around exactly GiantBiteAI's core differentiator (free, waste-reduction-focused tools).
- **2026 TikTok/Pinterest trend data** points to quick one-pan meals, high-protein comfort food, global-inspired dishes, and gut-health ingredients (kimchi, pickled onions, yogurt sauces) as what's currently spreading.
- **"The app goes silent once you start cooking"** is the most repeated complaint across every competitor (SideChef, Whisk, ChefGPT, Magic Chef AI) — own that gap directly with Coach-focused content.
- **Long-tail SEO** ("what to cook with leftover X", "budget meal prep for $Y") is lower-competition and higher-intent than head terms, and content clusters/FAQ schema are what 2026 SEO guidance points to.

## Before you post anything

- **Reddit is the highest-risk platform here.** Most cooking subreddits restrict or outright ban links/self-promotion, and many require account karma/age minimums. Read each target subreddit's rules and post as a genuine community member — the drafts are written value-first for this reason, but you still need to review and adapt per-subreddit.
- Treat Pinterest/Twitter/Facebook drafts the same way: read before posting, adjust tone/links per platform norms.
- TikTok scripts are outlines only — no video is generated.

## Running it daily

This is a script, not a service — nothing here keeps running in the background. Trigger it once a day with whichever scheduler you already have:

- Claude Code's `schedule` skill / `CronCreate` (`node marketing/openclaw.mjs` as the command), or
- Windows Task Scheduler, or
- any cron-like tool you point at this repo.

Needs the same `OPENROUTER_API_KEY` as the app (`.env` at the repo root).
