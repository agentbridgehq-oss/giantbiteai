import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { listBlogPosts, type BlogPostMeta } from "../lib/api";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostMeta[] | null>(null);

  useEffect(() => {
    listBlogPosts()
      .then((r) => setPosts(r.posts))
      .catch(() => setPosts([]));
  }, []);

  return (
    <div className="min-h-dvh bg-char-950">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">The GiantBiteAI Blog</h1>
        <p className="mt-3 text-gray-400">Fresh recipes, food tips, and guides — new content regularly.</p>

        <div className="mt-10 space-y-6">
          {posts === null && <p className="text-sm text-gray-500">Loading...</p>}
          {posts?.length === 0 && <p className="text-sm text-gray-500">No posts yet — check back soon.</p>}
          {posts?.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="group block overflow-hidden rounded-2xl border border-white/10 bg-char-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-ember-500/50 hover:shadow-glow"
            >
              {p.coverImage && (
                <div className="overflow-hidden">
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    loading="lazy"
                    className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {p.category && (
                    <span className="rounded-full bg-ember-500/10 px-2.5 py-0.5 font-semibold text-ember-400">{p.category}</span>
                  )}
                  <span>{p.date}</span>
                  {p.minutes && <span>· {p.minutes} min read</span>}
                </div>
                <h2 className="mt-2 font-display text-xl font-bold text-white">{p.title}</h2>
                <p className="mt-2 text-sm text-gray-400">{p.metaDescription}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-ember-400">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
