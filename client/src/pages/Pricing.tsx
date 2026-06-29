import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { setTier, useGbaState, PRO_PRICE_MONTHLY, REGULAR_PRICE_MONTHLY } from "../lib/storage";
import { createCheckout, verifyCheckout } from "../lib/api";
import { showToast } from "../lib/toast";

const PENDING_PLAN_KEY = "giantbiteai_pending_plan";

export default function Pricing() {
  const state = useGbaState();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState<"regular" | "pro" | null>(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) return;
    verifyCheckout(sessionId)
      .then(({ paid }) => {
        const pendingPlan = (localStorage.getItem(PENDING_PLAN_KEY) as "regular" | "pro" | null) || "pro";
        if (paid) {
          setTier(pendingPlan);
          showToast(`Payment confirmed — ${pendingPlan === "pro" ? "Pro" : "Regular"} unlocked!`);
        } else {
          showToast("That checkout wasn't completed.");
        }
      })
      .catch(() => showToast("Couldn't verify that payment — contact support if you were charged."))
      .finally(() => {
        localStorage.removeItem(PENDING_PLAN_KEY);
        setParams({}, { replace: true });
      });
  }, [params, setParams]);

  async function upgrade(plan: "regular" | "pro") {
    if (!agreed) {
      showToast("Please agree to the Terms of Service and Privacy Policy first.");
      return;
    }
    setLoading(plan);
    localStorage.setItem(PENDING_PLAN_KEY, plan);
    try {
      const { url } = await createCheckout(plan);
      window.location.href = url;
    } catch {
      setTier(plan);
      showToast(`Billing isn't live yet — ${plan === "pro" ? "Pro" : "Regular"} unlocked free for now.`);
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Pricing that pays for itself</h1>
        <p className="mt-3 max-w-2xl mx-auto text-gray-400">
          One skipped takeout order a month covers Regular. One skipped meal-kit subscription covers Pro.
          Start free, upgrade the moment the caps get in your way.
        </p>
      </div>

      <label className="mt-8 flex items-start gap-3 rounded-xl border border-char-800 bg-char-900/60 p-4 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-char-700 bg-char-900 text-ember-500 focus:ring-ember-500"
        />
        <span>
          I agree to the{" "}
          <Link to="/terms" target="_blank" className="text-ember-400 hover:underline">Terms of Service</Link>{" "}
          and{" "}
          <Link to="/privacy" target="_blank" className="text-ember-400 hover:underline">Privacy Policy</Link>,
          including the food-safety disclaimer (AI-generated recipes/nutrition may contain errors —
          always check ingredients against your own allergies and dietary needs).
        </span>
      </label>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-char-800 bg-char-900 p-7">
          <h2 className="text-lg font-bold text-white">Free</h2>
          <p className="mt-1 text-3xl font-bold text-white">$0</p>
          <p className="mt-1 text-xs text-gray-500">Get a real feel for what GiantBiteAI can do.</p>
          <ul className="mt-5 space-y-2.5 text-sm text-gray-400">
            <li>✓ 3 AI recipes a day — text or photo</li>
            <li>✓ 1 full meal plan + shopping list a week</li>
            <li>✓ 2 lifetime AI Coach messages, on us</li>
            <li>✓ Streaks, badges, money-saved tracker</li>
            <li>✓ No ads. Ever. Not now, not later.</li>
          </ul>
          <p className="mt-5 text-xs text-gray-500">{state.tier !== "free" ? "You're upgraded." : "You're on this plan right now."}</p>
        </div>

        <div className="rounded-2xl border border-char-700 bg-char-900 p-7">
          <h2 className="text-lg font-bold text-white">GiantBiteAI Regular</h2>
          <p className="mt-1 text-3xl font-bold text-white">
            ${REGULAR_PRICE_MONTHLY}
            <span className="text-sm font-normal text-gray-400">/mo</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">Everything you need to cook smarter every day — no caps, no waiting.</p>
          <ul className="mt-5 space-y-2.5 text-sm text-gray-300">
            <li>✓ Unlimited AI recipes, from ingredients or a fridge photo</li>
            <li>✓ Unlimited meal plans with auto-built shopping lists</li>
            <li>✓ Unlimited Drink Pairing — wine, beer, cocktail, and non-alcoholic matches</li>
            <li>✓ Unlimited Recipe Importer — blog links, YouTube videos, or raw text</li>
            <li>✓ My Pantry — track what you have before it expires</li>
            <li>✓ Kitchen Tools — unit converter and recipe scaler</li>
            <li>✓ Unlimited saves in My Recipes</li>
            <li>✓ Everything in Free</li>
            <li className="text-ember-400">🎁 Freebie: a permanent "Founding Member" badge on your Dashboard</li>
          </ul>
          {state.tier !== "free" ? (
            <button type="button" disabled className="mt-6 w-full rounded-full bg-char-800 py-3 text-sm font-semibold text-gray-400">
              {state.tier === "regular" ? "✓ Your current plan" : "✓ Already upgraded"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => upgrade("regular")}
              disabled={loading !== null || !agreed}
              className="mt-6 w-full rounded-full border border-char-700 py-3 text-sm font-semibold text-gray-300 transition hover:border-ember-500 hover:text-white disabled:opacity-60"
            >
              {loading === "regular" ? "Redirecting…" : `Upgrade — $${REGULAR_PRICE_MONTHLY}/mo`}
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-ember-500/40 bg-gradient-to-br from-ember-500/10 to-red-600/5 p-7">
          <h2 className="text-lg font-bold text-white">GiantBiteAI Pro</h2>
          <p className="mt-1 text-3xl font-bold text-white">
            ${PRO_PRICE_MONTHLY}
            <span className="text-sm font-normal text-gray-400">/mo</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">Regular, plus a real-time AI cooking coach and the full Academy.</p>
          <ul className="mt-5 space-y-2.5 text-sm text-gray-300">
            <li>✓ Everything in Regular, unlimited</li>
            <li>✓ Unlimited AI Cooking Coach — substitutions, timing, and technique help mid-recipe</li>
            <li>✓ Hands-Free Voice Mode — talk to the Coach, hands covered in flour and all</li>
            <li>✓ The complete GiantBiteAI Academy — all 9 lessons, all 3 tracks, fully unlocked</li>
            <li>✓ Priority support — your questions answered first</li>
            <li>✓ Early access to every new tool, before anyone else</li>
            <li className="text-ember-400">🎁 Freebie: "Founding Pro" badge, plus the Regular member badge</li>
            <li className="text-ember-400">🎁 Freebie: first access whenever we ship something new</li>
          </ul>
          {state.tier === "pro" ? (
            <button type="button" disabled className="mt-6 w-full rounded-full bg-char-800 py-3 text-sm font-semibold text-gray-400">
              ✓ You have Pro
            </button>
          ) : (
            <button
              type="button"
              onClick={() => upgrade("pro")}
              disabled={loading !== null || !agreed}
              className="btn-ember mt-6 w-full rounded-full py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
            >
              {loading === "pro" ? "Redirecting…" : `Upgrade — $${PRO_PRICE_MONTHLY}/mo`}
            </button>
          )}
          <p className="mt-3 text-xs text-gray-500">
            If billing isn't live yet, upgrades unlock free for now instead of redirecting.
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
