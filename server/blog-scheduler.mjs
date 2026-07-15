import { spawn } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Self-publishing daily blog scheduler — the SIMPLE path.
//
// Set SELF_PUBLISH_BLOG=1 on the WEB service and it runs the content generator
// once a day *inside this service*, writing straight to the BLOG_DATA_DIR volume
// it already serves from. That means NO separate cron service, NO BLOG_API_TOKEN,
// NO PUBLIC_BASE_URL — it just reuses the GEMINI_API_KEY and volume you already
// have here. A marker file in the volume guarantees it runs at most once per day
// even across restarts.
export function startDailyBlogScheduler() {
  const flag = process.env.SELF_PUBLISH_BLOG;
  if (!flag || flag === "0" || flag.toLowerCase() === "false") return;

  if (!process.env.GEMINI_API_KEY) {
    console.warn("[blog-scheduler] SELF_PUBLISH_BLOG is on but GEMINI_API_KEY is missing — daily posts will fail until it's set.");
  }

  const hour = Number.isFinite(Number(process.env.DAILY_BLOG_HOUR_UTC))
    ? Number(process.env.DAILY_BLOG_HOUR_UTC)
    : 14; // 14:00 UTC (~10am ET)
  const dataDir = process.env.BLOG_DATA_DIR || __dirname;
  const markerPath = join(dataDir, ".last-blog-run");
  const generator = join(__dirname, "..", "marketing", "openclaw.mjs");

  const today = () => new Date().toISOString().slice(0, 10);
  const lastRun = () => {
    try { return existsSync(markerPath) ? readFileSync(markerPath, "utf8").trim() : ""; }
    catch { return ""; }
  };

  let running = false;
  function tick() {
    if (running) return;
    if (new Date().getUTCHours() < hour) return; // not time yet today
    if (lastRun() === today()) return;            // already ran today
    running = true;
    try { writeFileSync(markerPath, today(), "utf8"); } catch { /* volume may not be writable yet */ }
    console.log(`[blog-scheduler] Running daily blog generator (${today()})...`);
    // Force the local-write path (no HTTP publish) so it writes to this service's volume.
    const child = spawn(process.execPath, [generator], {
      env: { ...process.env, BLOG_API_TOKEN: "", PUBLIC_BASE_URL: "" },
      stdio: "inherit",
    });
    child.on("exit", (code) => { running = false; console.log(`[blog-scheduler] generator finished (exit ${code}).`); });
    child.on("error", (err) => { running = false; console.error(`[blog-scheduler] could not start generator: ${err.message}`); });
  }

  setTimeout(tick, 15000);              // first check shortly after boot
  setInterval(tick, 30 * 60 * 1000);    // then every 30 minutes
  console.log(`[blog-scheduler] enabled — will publish daily at ${hour}:00 UTC (marker: ${markerPath}).`);
}
