# GiantBite daily blog — Railway setup (no GitHub secret needed)

This runs the daily content engine **inside your Railway project**, so it reuses the
`GEMINI_API_KEY` that's already there. Posts publish to a **persistent volume**, so
they survive redeploys. Mirrors how ClaudeCraft's OpenClaw works.

## One-time setup (≈5 min, all in Railway)

### 1. Persistent store on the web service
On the existing **GiantBite web service**:
- **Add a Volume** (Settings → Volumes), mount path e.g. `/data`.
- **Variables** → add:
  - `BLOG_DATA_DIR = /data`
  - `BLOG_API_TOKEN = <make up a long random string>`  ← the publish password
- Redeploy. Existing posts auto-seed into the volume on first run.

### 2. The cron service
Create a **new service in the same project**, from the same GitHub repo:
- Settings → **Config-as-code path**: `marketing/railway.cron.toml`
  (that file sets the start command `node marketing/openclaw.mjs` and a daily cron)
- Variables on this service:
  - `GEMINI_API_KEY` — inherit from the project (or paste the same value)
  - `BLOG_API_TOKEN` — **same value** as the web service above
  - `PUBLIC_BASE_URL = https://giantbiteai-production.up.railway.app` (or your domain)

### 3. Test it
Trigger the cron service once (Railway → the service → Deploy / Run). Check its logs
for `auto-published live to GiantBiteAI's own /blog/...`, then load `/blog` on the site.

## How it flows
`cron service` → generates 3 posts with Gemini → `POST /api/blog` (authed by `BLOG_API_TOKEN`)
→ web service writes them to the `/data` volume → `/blog` serves them. No GitHub secret,
no code deploy per post.

> The `.github/workflows/daily-blog.yml` GitHub Action is a manual-only alternative
> (run it from the Actions tab) — leave it unused if you're using this Railway cron.
