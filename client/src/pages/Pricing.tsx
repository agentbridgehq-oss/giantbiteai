import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { setPro, useGbaState, PRO_PRICE_MONTHLY, REGULAR_PRICE_MONTHLY } from "../lib/storage";
import { createCheckout, verifyCheckout } from "../lib/api";
import { showToast } from "../lib/toast";

export default function Pricing() {
  const state = useGbaState();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState<"regular" | "pro" | null>(null);

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

  async function upgrade(plan: "regular" | "pro") {
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
        <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">Simple pricing</h1>
        <p className="mt-3 text-slate-500">Start free. Upgrade if you want it unlimited.</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-char-800 bg-char-900 p-7">
          <h2 className="text-lg font-bold text-slate-900">Free</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">$0</p>
          <ul className="mt-5 space-y-2.5 text-sm text-slate-500">
            <li>✓ 3 recipes a day</li>
            <li>✓ 1 meal plan a week</li>
            <li>✓ 2 free AI Coach messages</li>
            <li>✓ Streaks, badges, savings tracker</li>
            <li>✓ No ads, ever</li>
          </ul>
          <p className="mt-5 text-xs text-slate-500">{state.isPro ? "You're upgraded." : "You're on this plan right now."}</p>
        </div>

        <div className="rounded-2xl border border-char-700 bg-char-900 p-7">
          <h2 className="text-lg font-bold text-slate-900">GiantBiteAI Regular</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            ${REGULAR_PRICE_MONTHLY}
            <span className="text-sm font-normal text-slate-500">/mo</span>
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
            <li>✓ Unlimited recipes</li>
            <li>✓ Unlimited meal plans</li>
            <li>✓ Unlimited AI Cooking Coach</li>
            <li>✓ Unlimited Drink Pairing</li>
            <li>✓ Full GiantBiteAI Academy guides</li>
            <li>✓ Everything in Free</li>
          </ul>
          {state.isPro ? (
            <button type="button" disabled className="mt-6 w-full rounded-full bg-char-800 py-3 text-sm font-semibold text-slate-500">
              ✓ Already upgraded
            </button>
          ) : (
            <button
              type="button"
              onClick={() => upgrade("regular")}
              disabled={loading !== null}
              className="mt-6 w-full rounded-full border border-char-700 py-3 text-sm font-semibold text-slate-700 transition hover:border-ember-500 hover:text-slate-900 disabled:opacity-60"
            >
              {loading === "regular" ? "Redirecting…" : `Upgrade — $${REGULAR_PRICE_MONTHLY}/mo`}
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-ember-500/40 bg-gradient-to-br from-ember-500/10 to-red-600/5 p-7">
          <h2 className="text-lg font-bold text-slate-900">GiantBiteAI Pro</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            ${PRO_PRICE_MONTHLY}
            <span className="text-sm font-normal text-slate-500">/mo</span>
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
            <li>✓ Everything in Regular</li>
            <li>✓ Priority support</li>
            <li>✓ Early access to new tools</li>
          </ul>
          {state.isPro ? (
            <button type="button" disabled className="mt-6 w-full rounded-full bg-char-800 py-3 text-sm font-semibold text-slate-500">
              ✓ You have Pro
            </button>
          ) : (
            <button
              type="button"
              onClick={() => upgrade("pro")}
              disabled={loading !== null}
              className="btn-ember mt-6 w-full rounded-full py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
            >
              {loading === "pro" ? "Redirecting…" : `Upgrade — $${PRO_PRICE_MONTHLY}/mo`}
            </button>
          )}
          <p className="mt-3 text-xs text-slate-500">
            If billing isn't live yet, upgrades unlock free for now instead of redirecting.
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        <Link to="/cook" className="text-ember-400 hover:underline">
          Back to cooking →
        </Link>
      </p>
    </div>
  );
}
