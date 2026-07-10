import { Link } from "react-router-dom";
import HomeChat from "./HomeChat";

export default function Hero() {
  return (
    <section className="bg-hero-glow relative overflow-hidden px-4 pb-20 pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-char-700 bg-char-900/80 px-4 py-1.5 text-xs font-medium text-gray-300">
            <span className="pulse-dot h-2 w-2 rounded-full bg-green-400" />
            Recipe Generator &middot; Meal Planner &middot; AI Coach
          </div>

          <h1 className="font-display text-5xl font-bold leading-tight text-white sm:text-6xl">
            The Future of
            <br />
            <span className="text-ember-gradient">Cooking is AI.</span>
            <br />
            <span className="text-gray-200">Free to Start.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-gray-400 sm:text-lg">
            Generate recipes, plan your week, and get real-time cooking help — no ads, no
            subscription required to try it.
          </p>

          <div className="mt-8 w-full max-w-md">
            <HomeChat />
          </div>

          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row">
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

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-500 md:justify-start">
            <span>✓ Free to start</span>
            <span>✓ No account needed</span>
            <span>✓ 3 tools, one app</span>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute -inset-6 rounded-[2rem] bg-ember-500/15 blur-3xl" aria-hidden />
          <img
            src="/hero-dish.webp"
            alt="Seared salmon in a cast-iron skillet, cooked with GiantBiteAI"
            className="relative w-full rounded-[2rem] border border-char-700 object-cover shadow-glow"
            loading="eager"
          />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-6xl overflow-hidden rounded-3xl border border-char-800">
        <img
          src="/ingredients-banner.webp"
          alt="Fresh ingredients on a dark counter"
          className="h-40 w-full object-cover sm:h-56"
          loading="lazy"
        />
      </div>

      <a href="#tools" className="mx-auto mt-14 block w-fit text-gray-500 transition hover:text-gray-300" aria-label="Scroll down">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="animate-bounce">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
