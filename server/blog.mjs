import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// The committed seed — ships with the repo, always present.
const REPO_STORE = join(__dirname, "blog-posts.json");

// Persistent store. On Railway, set BLOG_DATA_DIR to a mounted volume path so
// posts published by the daily cron survive redeploys. In local dev (no
// BLOG_DATA_DIR) we just read/write the committed file directly.
const DATA_DIR = process.env.BLOG_DATA_DIR || __dirname;
const STORE_PATH = join(DATA_DIR, "blog-posts.json");
const USING_VOLUME = !!process.env.BLOG_DATA_DIR;

function readJson(path) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : [];
  } catch {
    return [];
  }
}

// On first run against a fresh volume, seed it from the committed file.
function ensureSeeded() {
  if (USING_VOLUME && !existsSync(STORE_PATH)) {
    try {
      mkdirSync(DATA_DIR, { recursive: true });
      const seed = existsSync(REPO_STORE) ? readFileSync(REPO_STORE, "utf8") : "[]";
      writeFileSync(STORE_PATH, seed, "utf8");
    } catch {
      /* read-only FS in some environments — listPosts still falls back to the repo file */
    }
  }
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function listPosts() {
  const repoPosts = readJson(REPO_STORE);
  if (!USING_VOLUME) return repoPosts;

  ensureSeeded();
  const volPosts = readJson(STORE_PATH);
  // Merge: volume (cron-published) posts plus any committed posts not already
  // present, so both sources show. Newest first by date.
  const seen = new Set(volPosts.map((p) => p.slug));
  const merged = [...volPosts, ...repoPosts.filter((p) => !seen.has(p.slug))];
  return merged.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

export function getPost(slug) {
  return listPosts().find((p) => p.slug === slug) || null;
}

export function publishPost({ title, metaDescription, bodyMarkdown, date }) {
  ensureSeeded();
  const current = readJson(STORE_PATH).length ? readJson(STORE_PATH) : readJson(REPO_STORE);
  const slug = slugify(title);
  const post = {
    slug,
    title,
    metaDescription,
    bodyMarkdown,
    date: date || new Date().toISOString().slice(0, 10),
  };
  const next = [post, ...current.filter((p) => p.slug !== slug)];
  writeFileSync(STORE_PATH, JSON.stringify(next, null, 2), "utf8");
  return post;
}
