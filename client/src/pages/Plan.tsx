import { useState } from "react";
import { generateMealPlan, type MealPlanResponse } from "../lib/api";
import { recordPlanGenerated, touchDailyStreak, getState, canGeneratePlan, consumePlanUsage, isPaidTier } from "../lib/storage";
import UpgradePrompt from "../components/UpgradePrompt";

export default function Plan() {
  const [days, setDays] = useState(7);
  const [householdSize, setHouseholdSize] = useState(2);
  const [budgetLevel, setBudgetLevel] = useState("moderate");
  const [dietary, setDietary] = useState("");
  const [goals, setGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MealPlanResponse | null>(null);
  const [quotaBlocked, setQuotaBlocked] = useState(false);
  const state = getState();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canGeneratePlan(getState())) {
      setQuotaBlocked(true);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await generateMealPlan({ days, householdSize, budgetLevel, dietary, goals });
      setResult(res);
      recordPlanGenerated(res.estWeeklyCostUsd);
      consumePlanUsage();
      touchDailyStreak();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-char-800 bg-char-900 p-6">
        <h1 className="font-display text-2xl font-bold text-white">Meal Planner</h1>
        <p className="text-sm text-gray-400">A full week, reused ingredients, one shopping list.</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-300">Days</label>
            <input
              type="number"
              min={1}
              max={14}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white outline-none focus:border-ember-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-300">Household</label>
            <input
              type="number"
              min={1}
              max={10}
              value={householdSize}
              onChange={(e) => setHouseholdSize(Number(e.target.value))}
              className="w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white outline-none focus:border-ember-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-300">Budget</label>
          <select
            value={budgetLevel}
            onChange={(e) => setBudgetLevel(e.target.value)}
            className="w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white outline-none focus:border-ember-500"
          >
            <option value="tight">Tight</option>
            <option value="moderate">Moderate</option>
            <option value="generous">Generous</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-300">Dietary needs (optional)</label>
          <input
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            placeholder="e.g. vegetarian, gluten-free"
            className="w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-ember-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-300">Goals (optional)</label>
          <input
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g. high protein, quick dinners"
            className="w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-ember-500"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {!isPaidTier(state) && <p className="text-xs text-gray-500">Free plan: 1 meal plan per week. Regular and Pro are unlimited.</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-ember w-full rounded-full py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Planning..." : "Generate Plan"}
        </button>
      </form>

      <div>
        {quotaBlocked && <UpgradePrompt reason="You've used this week's free meal plan" />}
        {!quotaBlocked && !result && !loading && (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-char-800 text-gray-500">
            Your week will show up here.
          </div>
        )}
        {loading && (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-char-800 text-gray-400">
            <span className="flame-flicker text-3xl">🔥</span>
            Building your week...
          </div>
        )}
        {result && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 rounded-2xl border border-char-800 bg-char-900 p-5 text-sm">
              <span className="text-ember-400">💸 ~${result.estWeeklyCostUsd} for the week</span>
              <span className="text-gray-400">🔥 ~{result.estCaloriesPerDay} kcal/day</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-char-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-char-900 text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Day</th>
                    <th className="px-4 py-3 font-semibold">Breakfast</th>
                    <th className="px-4 py-3 font-semibold">Lunch</th>
                    <th className="px-4 py-3 font-semibold">Dinner</th>
                    <th className="px-4 py-3 font-semibold">Snack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-char-800 bg-char-950">
                  {result.days.map((d) => (
                    <tr key={d.day}>
                      <td className="px-4 py-3 font-semibold text-white">{d.day}</td>
                      <td className="px-4 py-3 text-gray-400">{d.breakfast}</td>
                      <td className="px-4 py-3 text-gray-400">{d.lunch}</td>
                      <td className="px-4 py-3 text-gray-400">{d.dinner}</td>
                      <td className="px-4 py-3 text-gray-400">{d.snack}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl border border-char-800 bg-char-900 p-6">
              <h3 className="font-display text-lg font-bold text-white">Shopping List</h3>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {result.shoppingList.map((cat) => (
                  <div key={cat.category}>
                    <h4 className="text-sm font-semibold text-ember-400">{cat.category}</h4>
                    <ul className="mt-1.5 space-y-1 text-sm text-gray-400">
                      {cat.items.map((it) => (
                        <li key={it.name}>• {it.qty} {it.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <a
                href="https://www.instacart.com/store/s?k=groceries"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ember mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                🛒 Shop this list on Instacart
              </a>
              <p className="mt-2 text-xs text-gray-500">Opens Instacart — add your items and check out there.</p>
            </div>

            {result.wasteReductionNotes.length > 0 && (
              <div className="rounded-2xl border border-char-800 bg-char-900 p-5 text-sm text-gray-400">
                <h4 className="mb-1.5 font-semibold text-white">♻️ Waste reduction notes</h4>
                <ul className="space-y-1">
                  {result.wasteReductionNotes.map((n, i) => (
                    <li key={i}>• {n}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
