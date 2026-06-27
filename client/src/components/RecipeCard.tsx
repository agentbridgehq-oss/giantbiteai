import { useState } from "react";
import type { Recipe } from "../lib/api";
import HandsFreeMode from "./HandsFreeMode";
import { showToast } from "../lib/toast";
import { isRecipeSaved, toggleSavedRecipe } from "../lib/storage";

export default function RecipeCard({ recipe: r }: { recipe: Recipe }) {
  const [handsFree, setHandsFree] = useState(false);
  const [saved, setSaved] = useState(() => isRecipeSaved(r.title));

  function share() {
    const text = `I just cooked "${r.title}" with GiantBiteAI — free AI recipes from whatever's in your kitchen. ${r.summary}`;
    if (navigator.share) {
      navigator.share({ title: "GiantBiteAI", text, url: window.location.origin }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.origin}`);
      showToast("Copied to clipboard!");
    }
  }

  function save() {
    const next = toggleSavedRecipe(r);
    setSaved(next);
    showToast(next ? "Saved to My Recipes" : "Removed from My Recipes");
  }

  return (
    <article className="rounded-2xl border border-char-800 bg-char-900 p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-slate-900">{r.title}</h2>
        <span className="whitespace-nowrap rounded-full bg-char-800 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
          {r.difficulty}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">{r.summary}</p>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
        <span>⏱ {r.prepMinutes + r.cookMinutes} min</span>
        <span>🍽 {r.servings} servings</span>
        <span>🔥 {r.nutrition.calories} kcal</span>
        <span className="text-ember-400">💸 saved ~${r.estMoneySavedUsd}</span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Ingredients</h3>
          <ul className="mt-1.5 space-y-1 text-sm text-slate-500">
            {r.ingredients.map((i) => (
              <li key={i.item}>• {i.amount} {i.item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Steps</h3>
          <ol className="mt-1.5 space-y-1.5 text-sm text-slate-500">
            {r.steps.map((s, i) => (
              <li key={i}>{i + 1}. {s}</li>
            ))}
          </ol>
        </div>
      </div>

      {r.substitutions.length > 0 && (
        <p className="mt-4 text-xs text-slate-500">
          <span className="font-semibold text-slate-500">Swaps: </span>
          {r.substitutions.join(" · ")}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-500">Waste tip: </span>
        {r.wasteTip}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setHandsFree(true)}
          className="btn-ember rounded-full px-4 py-2 text-xs font-semibold text-white"
        >
          🔊 Hands-Free Mode
        </button>
        <button
          type="button"
          onClick={save}
          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
            saved ? "border-ember-500 text-ember-400" : "border-char-700 text-slate-700 hover:border-ember-500 hover:text-slate-900"
          }`}
        >
          {saved ? "★ Saved" : "☆ Save Recipe"}
        </button>
        <button
          type="button"
          onClick={share}
          className="rounded-full border border-char-700 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-ember-500 hover:text-slate-900"
        >
          📤 Share this recipe
        </button>
      </div>

      {handsFree && <HandsFreeMode title={r.title} steps={r.steps} onClose={() => setHandsFree(false)} />}
    </article>
  );
}
