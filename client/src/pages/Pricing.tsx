import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { setPro, useGbaState, PRO_PRICE_MONTHLY, PRO_PRICE_YEARLY } from "../lib/storage";
import { createCheckout, verifyCheckout } from "../lib/api";
import { showToast } from "../lib/toast";

export default function Pricing() {
  const state = useGbaState();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState<"monthly" | "yearly" | null>(null);

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) return;
    verifyCheckout(sessionId)
      .then(({ paid }) => {
        if (paid) {
          setPro(true);
          showToast("Payment confirmed — Pro unlocked!");
        } else {
          showToast("That checkout wasn't completed.");
        }
      })
      .catch(() => showToast("Couldn't verify that payment — contact support if you were charged."))
      .finally(() => setParams({}, { replace: true }));
  }, [params, setParams]);

  async function upgrade(plan: "monthly" | "yearly") {
    setLoading(plan);
    try {
      const { url } = await createCheckout(plan);
      window.location.href = url;
    } catch {
      setPro(true);
      showToast("Billing isn't live yet — Pro unlocked free for now.");
      setLoading(null);
    }
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
            <li>✓ Unlimited Drink Pairing</li>
            <li>✓ Full GiantBiteAI Academy guides</li>
            <li>✓ Everything in Free</li>
          </ul>
          {state.isPro ? (
            <button disabled className="mt-6 w-full rounded-full bg-char-800 py-3 text-sm font-semibold text-gray-400">
              ✓ You have Pro
            </button>
          ) : (
            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => upgrade("monthly")}
                disabled={loading !== null}
                className="btn-ember w-full rounded-full py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
              >
                {loading === "monthly" ? "Redirecting…" : `Upgrade — $${PRO_PRICE_MONTHLY}/mo`}
              </button>
              <button
                type="button"
                onClick={() => upgrade("yearly")}
                disabled={loading !== null}
                className="w-full rounded-full border border-char-700 py-3 text-sm font-semibold text-gray-300 transition hover:border-ember-500 hover:text-white disabled:opacity-60"
              >
                {loading === "yearly" ? "Redirecting…" : `Upgrade — $${PRO_PRICE_YEARLY}/yr`}
              </button>
            </div>
          )}
          <p className="mt-3 text-xs text-gray-500">
            If billing isn't live yet, Pro unlocks free for now instead of redirecting.
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
