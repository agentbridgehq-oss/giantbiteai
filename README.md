# GiantBiteAI

**The Future of Cooking is AI. And It's Free.**

Three AI cooking tools — Recipe Generator, Meal Planner, and AI Cooking Coach — powered by DeepSeek-R1 and Qwen-VL via OpenRouter. Open source. Forever free. No subscriptions, no ads.

## Why this exists (positioning)

Researched the AI-recipe-app space (SideChef, Whisk, ChefGPT, Mealime, FoodiePrep, TasteOS, Honeydew) before building. Two patterns showed up everywhere:

1. **Paywalls and ads on the free tier.** SideChef ($4.99/mo or $49.99/yr), Whisk ($2.99/mo, 5 free recipes/mo), ChefGPT ($2.99/mo) all gate the core experience.
2. **Every app goes silent once you're actually cooking.** None offer real-time, conversational help mid-recipe.

GiantBiteAI is built directly against both gaps: the three core tools have no paywall, and the **AI Cooking Coach** is a live chat for exactly the moment every other app abandons you. Target audience: busy home cooks 28–55 — the highest grocery spend, most waste/budget pressure, and most likely to actually share a "look how much I saved" stat.

## Features

- **Recipe Generator** — text or photo input (Qwen-VL identifies ingredients from a fridge/pantry photo), leftovers-rescue mode, dietary + calorie targeting, taste-preference personalization.
- **Recipe Importer** — paste a URL or raw text, AI strips ads/junk and returns a clean structured recipe.
- **Meal Planner** — multi-day plan + a shopping list that reuses ingredients across days to cut waste.
- **AI Cooking Coach** — streaming chat for substitutions, timing, technique, food-safety temps, while you're mid-recipe.
- **Hands-Free Mode** — text-to-speech step walkthrough with optional voice commands ("next", "back", "repeat") on every recipe.
- **Growth loop** — daily streaks, badges, a running "money saved / meals rescued" counter, shareable stats cards, and a referral link. All client-side (localStorage), no account required.

## Stack

- `client/` — Vite + React + TypeScript + Tailwind, single-page app with React Router.
- `server/` — Express, proxies OpenRouter (keeps your API key off the client).
- No database — growth/streak state lives in the browser's `localStorage` by design (zero signup friction).

## Setup

```bash
npm run install:all
cp .env.example .env   # then add your OPENROUTER_API_KEY (https://openrouter.ai/keys)
npm run dev             # server on :8787, client on :5173 (proxies /api to the server)
```

Model slugs are configurable via `TEXT_MODEL` / `VISION_MODEL` in `.env` — verify current ids at https://openrouter.ai/models if a call ever 404s (model slugs change over time).

## Marketing pipeline

See [`marketing/README.md`](marketing/README.md) — a single script that drafts a daily blog article plus platform-adapted social posts, grounded in researched recipe-content trends. It **only writes drafts to disk**; it never posts anywhere on its own.
