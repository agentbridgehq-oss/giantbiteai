import { Link } from "react-router-dom";

const POINTS = [
  {
    title: "Large, clear controls",
    body: "Turn on Comfort Mode for bigger text, bigger buttons, and optional high contrast. Built for tired eyes and busy hands.",
  },
  {
    title: "Plain language",
    body: "We say “what’s for dinner” — not product buzzwords. Steps read like a patient friend in the kitchen.",
  },
  {
    title: "Hands-free help",
    body: "Listen to steps while your hands are messy. Ask the Coach mid-recipe: substitutes, timing, “is this done?”",
  },
  {
    title: "Use what you already bought",
    body: "Leftovers mode and pantry tools fight food waste — practical for fixed budgets and full fridges alike.",
  },
];

/** Landing section aimed at 55+ and non-tech everyday cooks — still useful for everyone. */
export default function ForEveryone() {
  return (
    <section id="for-you" className="px-4 py-20" aria-labelledby="for-you-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-ember-400">For 55+ &amp; every cook</p>
          <h2 id="for-you-heading" className="gba-section-title mt-3 font-display text-3xl sm:text-4xl md:text-5xl">
            The cooking app that doesn’t talk down to you
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-300 sm:text-xl">
            TikTok-first apps often forget people who want calm, reliable help — not a race for trends.
            GiantBiteAI is for regular people first: grandparents, busy parents, beginners, and anyone who wants dinner without the drama.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="rounded-3xl border border-char-700 bg-gradient-to-b from-char-900 to-char-950 p-6 sm:p-8"
            >
              <h3 className="text-xl font-bold text-white">{p.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-gray-300 sm:text-lg">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/cook"
            className="btn-ember inline-flex min-h-[52px] items-center justify-center rounded-full px-8 py-4 text-lg font-bold text-white shadow-glow"
          >
            Try a recipe free →
          </Link>
          <Link
            to="/coach"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-char-600 px-8 py-4 text-lg font-bold text-gray-100 hover:border-ember-500"
          >
            Meet the Coach
          </Link>
        </div>
      </div>
    </section>
  );
}
