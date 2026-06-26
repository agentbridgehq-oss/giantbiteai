import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-hero-glow relative overflow-hidden px-4 pb-24 pt-20 text-center">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-char-700 bg-char-900/80 px-4 py-1.5 text-xs font-medium text-gray-300">
          <span className="pulse-dot h-2 w-2 rounded-full bg-green-400" />
          Recipe Generator &middot; Meal Planner &middot; AI Coach
        </div>

        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          The Future of
          <br />
          <span className="text-ember-gradient">Cooking is AI.</span>
          <br />
          <span className="text-gray-200">Free to Start.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base text-gray-400 sm:text-lg">
          Three powerful AI tools. One mission: make cooking smarter, healthier, and waste-free.
          Generate recipes, plan your week, and get real-time cooking help — no ads, ever.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/cook"
            className="btn-ember flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            🍳 Start Cooking <span aria-hidden>→</span>
          </Link>
          <a
            href="#tools"
            className="flex items-center gap-2 rounded-full border border-char-700 bg-char-900 px-7 py-3.5 text-base font-semibold text-gray-200 transition hover:border-char-600 hover:text-white"
          >
            ⬚ Explore Tools
          </a>
        </div>

        <a href="#tools" className="mt-14 text-gray-500 transition hover:text-gray-300" aria-label="Scroll down">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="animate-bounce">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
