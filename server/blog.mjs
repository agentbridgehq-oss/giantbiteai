import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORE_PATH = join(__dirname, "blog-posts.json");

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function listPosts() {
  if (!existsSync(STORE_PATH)) return [];
  return JSON.parse(readFileSync(STORE_PATH, "utf8"));
}

export function getPost(slug) {
  return listPosts().find((p) => p.slug === slug) || null;
}

export function publishPost({ title, metaDescription, bodyMarkdown, date }) {
  const posts = listPosts();
  const slug = slugify(title);
  const post = {
    slug,
    title,
    metaDescription,
    bodyMarkdown,
    date: date || new Date().toISOString().slice(0, 10),
  };
  const next = [post, ...posts.filter((p) => p.slug !== slug)];
  writeFileSync(STORE_PATH, JSON.stringify(next, null, 2), "utf8");
  return post;
}
