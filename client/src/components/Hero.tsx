import { Link } from "react-router-dom";
import HomeChat from "./HomeChat";
import PhoneMockup from "./PhoneMockup";
import ComfortBar from "./ComfortBar";

export default function Hero() {
  return (
    <section className="bg-hero-glow relative overflow-hidden px-4 pb-20 pt-12 sm:pt-16">
      <div className="mx-auto mb-8 flex max-w-6xl justify-center md:justify-start">
        <ComfortBar />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-char-700 bg-char-900/90 px-4 py-2 text-sm font-semibold text-gray-200 md:justify-start">
            <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-green-400" aria-hidden />
            Built for real kitchens · 55+ and every age
          </div>

          <h1 className="gba-section-title font-display text-4xl sm:text-5xl md:text-6xl">
            What’s in your kitchen
            <br />
            <span className="text-ember-gradient">becomes dinner.</span>
            <br />
            <span className="text-gray-100">Simple. Free to start.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300 sm:text-xl">
            GiantBiteAI helps you use what you already have — leftovers, pantry staples, a fridge photo —
            then walks you through cooking with clear steps and a coach you can ask mid-recipe.
            Big buttons. Plain language. No account required.
          </p>

          <ul className="mt-6 w-full max-w-md space-y-2 text-left text-base text-gray-300">
            <li className="flex gap-3">
              <span className="text-ember-400 font-bold" aria-hidden>✓</span>
              <span>Type ingredients or snap a photo of your fridge</span>
            </li>
            <li className="flex gap-3">
              <span className="text-ember-400 font-bold" aria-hidden>✓</span>
              <span>Get real recipes — not vague internet filler</span>
            </li>
            <li className="flex gap-3">
              <span className="text-ember-400 font-bold" aria-hidden>✓</span>
              <span>Hands-free step reading while you cook</span>
            </li>
            <li className="flex gap-3">
              <span className="text-ember-400 font-bold" aria-hidden>✓</span>
              <span>Comfort Mode: larger text &amp; high contrast anytime</span>
            </li>
          </ul>

          <div className="mt-8 w-full max-w-md">
            <HomeChat />
          </div>

          <div className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-stretch">
            <Link
              to="/cook"
              className="btn-ember flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full px-7 py-4 text-lg font-bold text-white shadow-glow transition hover:brightness-110"
            >
              Start cooking <span aria-hidden>→</span>
            </Link>
            <a
              href="#how"
              className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full border-2 border-char-600 bg-char-900 px-7 py-4 text-lg font-bold text-gray-100 transition hover:border-ember-500 hover:text-white"
            >
              How it works
            </a>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-gray-400 md:text-base">
            Free to try · No sign-up wall · No ads · Works on phone and computer
          </p>
        </div>

        <div className="hidden md:block">
          <PhoneMockup />
        </div>
      </div>

      <a
        href="#tools"
        className="mx-auto mt-14 block w-fit rounded-full px-4 py-3 text-gray-400 transition hover:text-gray-200"
        aria-label="Scroll to tools"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animate-bounce" aria-hidden>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
