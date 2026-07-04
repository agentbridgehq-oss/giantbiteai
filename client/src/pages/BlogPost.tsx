import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { marked } from "marked";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { getBlogPost, type BlogPost } from "../lib/api";

export default function BlogPostPage() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getBlogPost(slug)
      .then((r) => setPost(r.post))
      .catch(() => setNotFound(true));
  }, [slug]);

  return (
    <div className="bg-char-950">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Link to="/blog" className="text-sm text-ember-400 hover:underline">
          ← All articles
        </Link>
        {notFound && <p className="mt-6 text-gray-400">Couldn't find that article.</p>}
        {post && (
          <article className="mt-6">
            <p className="text-xs text-gray-500">{post.date}</p>
            <h1 className="mt-1.5 font-display text-3xl font-bold text-white">{post.title}</h1>
            <div
              className="mt-6 text-gray-300 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_p]:my-4 [&_p]:leading-relaxed [&_strong]:text-gray-100 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1"
              dangerouslySetInnerHTML={{ __html: marked.parse(post.bodyMarkdown.replace(/^#[^\n]*\n/, "")) as string }}
            />
            <div className="mt-10 rounded-2xl border border-ember-500/30 bg-gradient-to-br from-ember-500/10 to-red-600/5 p-6 text-center">
              <p className="text-sm text-gray-300">Want a recipe built around what's already in your kitchen?</p>
              <Link to="/cook" className="btn-ember mt-3 inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-white">
                Try the free Recipe Generator →
              </Link>
            </div>
          </article>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
