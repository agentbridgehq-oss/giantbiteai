import { useState } from "react";
import { WEEKLY_ARTICLE } from "../lib/weeklyArticle";

export default function WeeklyArticle() {
  const [open, setOpen] = useState(false);
  const a = WEEKLY_ARTICLE;

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-char-800 bg-char-900 p-8 sm:p-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ember-400">
          <span>{a.week}</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400">{a.category}</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400">{a.minutes} min read</span>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-white sm:text-3xl">{a.title}</h2>
        <p className="mt-3 text-base text-gray-300">{a.dek}</p>

        {open ? (
          <div className="mt-6 space-y-4 border-t border-char-800 pt-6 text-sm leading-relaxed text-gray-300">
            {a.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 rounded-full border border-char-700 px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-ember-500 hover:text-white"
          >
            Read the full article →
          </button>
        )}
      </div>
    </section>
  );
}
