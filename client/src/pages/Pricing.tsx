import { Link } from "react-router-dom";
import { setPro, useGbaState, PRO_PRICE_MONTHLY, PRO_PRICE_YEARLY } from "../lib/storage";

export default function Pricing() {
  const state = useGbaState();

  function unlockPro() {
    setPro(true);
    alert("Pro unlocked! Billing isn't live yet, so it's free while we finish that — enjoy unlimited access.");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Simple pricing</h1>
        <p className="mt-3 text-gray-400">Start free. Upgrade if you want it unlimited.</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-char-800 bg-char-900 p-7">
          <h2 className="text-lg font-bold text-white">Free</h2>
          <p className="mt-1 text-3xl font-bold text-white">$0</p>
          <ul className="mt-5 space-y-2.5 text-sm text-gray-400">
            <li>✓ 3 recipes a day</li>
            <li>✓ 1 meal plan a week</li>
            <li>✓ 2 free AI Coach messages</li>
            <li>✓ Streaks, badges, savings tracker</li>
            <li>✓ No ads, ever</li>
          </ul>
          <p className="mt-5 text-xs text-gray-500">{state.isPro ? "You're on Pro." : "You're on this plan right now."}</p>
        </div>

        <div className="rounded-2xl border border-ember-500/40 bg-gradient-to-br from-ember-500/10 to-red-600/5 p-7">
          <h2 className="text-lg font-bold text-white">Pro</h2>
          <p className="mt-1 text-3xl font-bold text-white">
            ${PRO_PRICE_MONTHLY}
            <span className="text-sm font-normal text-gray-400">/mo</span>
          </p>
          <p className="text-xs text-gray-500">or ${PRO_PRICE_YEARLY}/yr</p>
          <ul className="mt-5 space-y-2.5 text-sm text-gray-300">
            <li>✓ Unlimited recipes</li>
            <li>✓ Unlimited meal plans</li>
            <li>✓ Unlimited AI Cooking Coach</li>
            <li>✓ Everything in Free</li>
          </ul>
          {state.isPro ? (
            <button disabled className="mt-6 w-full rounded-full bg-char-800 py-3 text-sm font-semibold text-gray-400">
              ✓ You have Pro
            </button>
          ) : (
            <button onClick={unlockPro} className="btn-ember mt-6 w-full rounded-full py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110">
              Upgrade to Pro
            </button>
          )}
          <p className="mt-3 text-xs text-gray-500">
            Billing isn't live yet — Pro is unlocked free for now while that's built.
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        <Link to="/cook" className="text-ember-400 hover:underline">
          Back to cooking →
        </Link>
      </p>
    </div>
  );
}
