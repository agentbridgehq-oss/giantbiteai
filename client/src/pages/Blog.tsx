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
    <div className="bg-char-950">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">The GiantBiteAI Blog</h1>
        <p className="mt-3 text-gray-400">Fresh recipes, food tips, and guides — new content regularly.</p>

        <div className="mt-10 space-y-8">
          {posts === null && <p className="text-sm text-gray-500">Loading...</p>}
          {posts?.length === 0 && <p className="text-sm text-gray-500">No posts yet — check back soon.</p>}
          {posts?.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="block border-b border-char-800 pb-8 transition hover:opacity-80">
              <p className="text-xs text-gray-500">{p.date}</p>
              <h2 className="mt-1.5 font-display text-xl font-bold text-white">{p.title}</h2>
              <p className="mt-2 text-sm text-gray-400">{p.metaDescription}</p>
              <span className="mt-2 inline-block text-sm text-ember-400">Read more →</span>
            </Link>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
