import { useState } from "react";
import { generatePairing, type PairingResponse } from "../lib/api";
import { getState, canGenerateRecipe, consumeRecipeUsage } from "../lib/storage";
import UpgradePrompt from "../components/UpgradePrompt";

const ROWS: { key: keyof PairingResponse; label: string; emoji: string }[] = [
  { key: "wine", label: "Wine", emoji: "🍷" },
  { key: "beer", label: "Beer", emoji: "🍺" },
  { key: "cocktail", label: "Cocktail", emoji: "🍸" },
  { key: "nonAlcoholic", label: "Non-Alcoholic", emoji: "🥤" },
];

export default function Pairing() {
  const [dish, setDish] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PairingResponse | null>(null);
  const [quotaBlocked, setQuotaBlocked] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dish.trim()) return;
    if (!canGenerateRecipe(getState())) {
      setQuotaBlocked(true);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await generatePairing(dish.trim());
      setResult(res);
      consumeRecipeUsage();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-slate-900">Drink Pairing</h1>
      <p className="mt-1 text-sm text-slate-500">Tell us the dish, get four real pairing options.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          placeholder="e.g. spicy garlic shrimp pasta"
          className="flex-1 rounded-full border border-char-700 bg-char-900 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-ember-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-ember rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Pairing…" : "Pair it"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {quotaBlocked && (
        <div className="mt-6">
          <UpgradePrompt reason="You've used today's free pairings" />
        </div>
      )}

      {result && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {ROWS.map(({ key, label, emoji }) => (
            <div key={key} className="rounded-2xl border border-char-800 bg-char-900 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ember-400">{emoji} {label}</p>
              <p className="mt-1.5 font-display text-lg font-bold text-slate-900">{result[key].suggestion}</p>
              <p className="mt-1 text-sm text-slate-500">{result[key].why}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
