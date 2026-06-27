# GiantBiteAI

**The Future of Cooking is AI.**

Three AI cooking tools — Recipe Generator, Meal Planner, and AI Cooking Coach — with a generous free tier and a Pro subscription for unlimited use.

> **Internal note (not for public copy):** the backend runs on Google Gemini (`server/gemini.mjs`, multimodal — handles both text and photo input in one model). Per Ken's instruction, never name or imply the AI provider/model in any public-facing copy (site, marketing, FAQ) unless legally required — this file is internal engineering documentation, not site content.

## Why this exists (positioning)

Researched the AI-recipe-app space (SideChef, Whisk, ChefGPT, Mealime, FoodiePrep, TasteOS, Honeydew) before building. Two patterns showed up everywhere:

1. **Paywalls and ads on the free tier.** SideChef ($4.99/mo or $49.99/yr), Whisk ($2.99/mo, 5 free recipes/mo), ChefGPT ($2.99/mo) all gate the core experience hard.
2. **Every app goes silent once you're actually cooking.** None offer real-time, conversational help mid-recipe.

GiantBiteAI's free tier is more generous than any competitor's (3 recipes/day + 1 meal plan/week + a couple of free Coach messages, with no ads), and **AI Cooking Coach** access is the main Pro hook — a live chat for exactly the moment every other app abandons you. Target audience: everyone, with 55+ called out specifically (Ken's call) since they're underserved by TikTok-first competitors but still need (and will pay for) genuinely simple, reliable help.

## Pricing model

Freemium — confirmed 2026-06-26, prices bumped +$1 2026-06-27:
- **Free:** 3 recipes/day, 1 meal plan/week, 2 lifetime free Coach messages (a taste of the differentiator).
- **Pro ($5.99/mo or $40/yr):** unlimited recipes/plans, full AI Cooking Coach, unlimited Drink Pairing, full Academy guides.
- Payment processing (Stripe) is not yet wired — `/pricing` currently unlocks Pro client-side as a "free while billing isn't live yet" gesture. See `client/src/pages/Pricing.tsx`.

## Features

- **Recipe Generator** — text or photo input, leftovers-rescue mode, dietary + calorie targeting, taste-preference personalization, pulls straight from My Pantry.
- **Recipe Importer** — paste a URL or raw text, AI strips ads/junk and returns a clean structured recipe.
- **Meal Planner** — multi-day plan + a shopping list that reuses ingredients across days to cut waste.
- **AI Cooking Coach** — streaming chat for substitutions, timing, technique, food-safety temps, while you're mid-recipe. Pro-gated after 2 free messages. Voice in and voice out.
- **My Pantry** — persistent pantry/fridge list with expiry tracking, feeds directly into the Recipe Generator.
- **Kitchen Tools** — instant unit converter + recipe scaler, no AI call, no quota used.
- **Drink Pairing** — wine/beer/cocktail/non-alcoholic suggestions for any dish.
- **GiantBiteAI Academy** — real technique/nutrition guides (knife skills, flavor pillars, macros, budget eating); previews free, full lessons are a Pro perk.
- **My Recipes** — save/unsave any generated recipe, browse your collection on the Dashboard.
- **Hands-Free Mode** — text-to-speech step walkthrough with optional voice commands ("next", "back", "repeat") on every recipe.
- **Growth loop** — daily streaks, badges, a running "money saved / meals rescued" counter, shareable stats cards, and a referral link. All client-side (localStorage), no account required.

## Stack

- `client/` — Vite + React + TypeScript + Tailwind, single-page app with React Router.
- `server/` — Express, proxies Gemini (keeps your API key off the client).
- No database — growth/streak state and Pro status live in the browser's `localStorage` by design (zero signup friction; also means clearing browser storage resets Pro status until real accounts/payments exist).

## Setup

```bash
npm run install:all
cp .env.example .env   # then add your GEMINI_API_KEY (https://aistudio.google.com/apikey)
npm run dev             # server on :8787, client on :5173 (proxies /api to the server)
```

## Deployment

Live on Railway (project `giantbiteai`, org `agentbridgehq-oss`). `railway.toml` builds with Nixpacks (`npm run install:all && npm run build`) and starts via `npm start`, which serves the built client (`client/dist`) and the API from one Express process. Add `GEMINI_API_KEY` in the Railway service's Variables tab to make AI calls actually work in production.

## Marketing pipeline

See [`marketing/README.md`](marketing/README.md) — a single script that drafts a daily blog article plus platform-adapted social posts, grounded in researched recipe-content trends. It **only writes drafts to disk**; it never posts anywhere on its own, and never names the AI provider.
