/**
 * Minimal allowlist HTML sanitizer for content we render via
 * dangerouslySetInnerHTML (currently: marked-rendered blog post markdown).
 *
 * marked() converts markdown to HTML but does NOT sanitize — any raw HTML
 * embedded in the source markdown (e.g. `<script>`, `<img onerror=...>`,
 * `<a href="javascript:...">`) passes straight through. Blog posts are
 * AI-generated (server/prompts.mjs + marketing/openclaw.mjs) and published
 * either by the daily cron (X-OpenClaw-Token auth) or the in-process
 * self-publish scheduler, so this isn't directly attacker-facing today —
 * but nothing stops a future draft (or a prompt-injected model output) from
 * containing HTML, and there's no reason this sink should trust it. Strip
 * anything not on the allowlist before it reaches the DOM.
 */
const ALLOWED_TAGS = new Set([
  "P", "BR", "STRONG", "EM", "B", "I", "U", "S", "DEL",
  "H1", "H2", "H3", "H4", "H5", "H6",
  "UL", "OL", "LI", "BLOCKQUOTE", "HR",
  "A", "IMG", "CODE", "PRE", "SPAN", "TABLE", "THEAD", "TBODY", "TR", "TH", "TD",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  A: new Set(["href", "title"]),
  IMG: new Set(["src", "alt", "title"]),
};

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();
  // Allow relative/absolute paths and http(s)/mailto links; block javascript:,
  // data:, vbscript:, and anything else that can execute in-page.
  if (/^(https?:|mailto:)/i.test(trimmed)) return true;
  if (/^[/#]/.test(trimmed)) return true;
  return false;
}

export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");

  function clean(node: Node) {
    // Walk a static snapshot since we mutate (remove) nodes as we go.
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        if (!ALLOWED_TAGS.has(el.tagName)) {
          // Unwrap unknown/unsafe tags (keep their text content) rather than
          // dropping the content outright — e.g. a stray <script> is removed
          // entirely (including its text), everything else keeps its text.
          if (el.tagName === "SCRIPT" || el.tagName === "STYLE" || el.tagName === "IFRAME" || el.tagName === "OBJECT" || el.tagName === "EMBED") {
            el.remove();
            continue;
          }
          const parent = el.parentNode;
          while (el.firstChild) parent?.insertBefore(el.firstChild, el);
          parent?.removeChild(el);
          continue;
        }
        for (const attr of Array.from(el.attributes)) {
          const name = attr.name.toLowerCase();
          const allowed = ALLOWED_ATTRS[el.tagName];
          if (name.startsWith("on") || !allowed || !allowed.has(name)) {
            el.removeAttribute(attr.name);
            continue;
          }
          if ((name === "href" || name === "src") && !isSafeUrl(attr.value)) {
            el.removeAttribute(attr.name);
          }
        }
        if (el.tagName === "A") el.setAttribute("rel", "noopener noreferrer nofollow");
        clean(el);
      } else if (child.nodeType !== Node.TEXT_NODE) {
        // Drop comments and anything else that isn't plain text/elements.
        node.removeChild(child);
      }
    }
  }

  clean(doc.body);
  return doc.body.innerHTML;
}
