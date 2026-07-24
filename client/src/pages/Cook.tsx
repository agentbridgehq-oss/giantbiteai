import { useRef, useState } from "react";
import { generateRecipe, importRecipe, type Recipe, type RecipeResponse } from "../lib/api";
import {
  recordRecipeGenerated,
  touchDailyStreak,
  getState,
  getTopTasteTags,
  canGenerateRecipe,
  consumeRecipeUsage,
  isPaidTier,
  FREE_RECIPES_PER_DAY,
} from "../lib/storage";
import RecipeCard from "../components/RecipeCard";
import UpgradePrompt from "../components/UpgradePrompt";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Cook() {
  const [mode, setMode] = useState<"ingredients" | "import">("ingredients");

  const [ingredientsText, setIngredientsText] = useState("");
  const [dietary, setDietary] = useState("");
  const [targetCalories, setTargetCalories] = useState("");
  const [leftoversMode, setLeftoversMode] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [importInput, setImportInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecipeResponse | null>(null);
  const [importedRecipe, setImportedRecipe] = useState<Recipe | null>(null);
  const [quotaBlocked, setQuotaBlocked] = useState(false);
  const state = getState();
  const remaining = isPaidTier(state) ? null : Math.max(0, FREE_RECIPES_PER_DAY - state.recipesToday);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setPhotoPreview(dataUrl);
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!ingredientsText.trim() && !photoPreview) {
      setError("Add a photo or type at least one ingredient.");
      return;
    }
    if (!canGenerateRecipe(getState())) {
      setQuotaBlocked(true);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setImportedRecipe(null);
    try {
      const tastePreferences = getTopTasteTags(getState(), 4);
      const res = await generateRecipe({
        ingredientsText,
        photoBase64: photoPreview || undefined,
        dietary,
        leftoversMode,
        tastePreferences,
        targetCalories: targetCalories ? Number(targetCalories) : undefined,
      });
      setResult(res);
      const topSaved = res.recipes[0]?.estMoneySavedUsd ?? 0;
      const tasteText = res.recipes.map((r) => `${r.title} ${r.ingredients.map((i) => i.item).join(" ")}`).join(" ");
      recordRecipeGenerated(topSaved, leftoversMode, Boolean(photoPreview), tasteText);
      consumeRecipeUsage();
      touchDailyStreak();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!importInput.trim()) {
      setError("Paste a recipe link or the recipe text.");
      return;
    }
    if (!canGenerateRecipe(getState())) {
      setQuotaBlocked(true);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setImportedRecipe(null);
    try {
      const isUrl = /^https?:\/\//i.test(importInput.trim());
      const { recipe } = await importRecipe(isUrl ? { url: importInput.trim() } : { rawText: importInput.trim() });
      setImportedRecipe(recipe);
      const tasteText = `${recipe.title} ${recipe.ingredients.map((i) => i.item).join(" ")}`;
      recordRecipeGenerated(0, false, false, tasteText);
      consumeRecipeUsage();
      touchDailyStreak();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't import that recipe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(320px,420px)_1fr]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-ember-500/30 bg-ember-500/10 px-4 py-3 text-base text-gray-200">
          <strong className="text-white">Tip:</strong> Start with 2–4 things you already have (for example: eggs, rice, onion).
          Or add a fridge photo. No account needed.
        </div>
        <div className="flex gap-1 rounded-2xl border border-char-700 bg-char-900 p-1.5" role="tablist" aria-label="Recipe mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "ingredients"}
            onClick={() => setMode("ingredients")}
            className={`min-h-[48px] flex-1 rounded-xl py-3 text-base font-bold transition ${mode === "ingredients" ? "btn-ember text-white" : "text-gray-300"}`}
          >
            What I have
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "import"}
            onClick={() => setMode("import")}
            className={`min-h-[48px] flex-1 rounded-xl py-3 text-base font-bold transition ${mode === "import" ? "btn-ember text-white" : "text-gray-300"}`}
          >
            Import recipe
          </button>
        </div>

        {mode === "ingredients" ? (
          <form onSubmit={handleGenerate} className="space-y-5 rounded-3xl border border-char-700 bg-char-900 p-6 sm:p-7">
            <h1 className="font-display text-3xl font-bold text-white">Make a recipe</h1>
            <p className="text-base leading-relaxed text-gray-300">
              Type what you have, or snap your fridge or pantry. We will suggest clear recipes you can actually cook.
            </p>

            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="ingredients" className="block text-base font-bold text-gray-100">
                  Ingredients
                </label>
                {state.pantryItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIngredientsText(state.pantryItems.map((i) => i.name).join(", "))}
                    className="min-h-[40px] text-base font-semibold text-ember-400 hover:underline"
                  >
                    Use my pantry list
                  </button>
                )}
              </div>
              <textarea
                id="ingredients"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="Example: chicken, rice, onion, eggs..."
                rows={4}
                className="w-full rounded-2xl border border-char-700 bg-char-950 px-4 py-3 text-base text-white placeholder-gray-500 outline-none focus:border-ember-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-base font-bold text-gray-100">Or add a photo</label>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhoto}
                className="hidden"
                aria-label="Upload a fridge or pantry photo"
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="w-full min-h-[56px] rounded-2xl border-2 border-dashed border-char-600 bg-char-950 px-4 py-5 text-base font-semibold text-gray-200 transition hover:border-ember-500 hover:text-white"
              >
                {photoPreview ? "Photo attached — tap to replace" : "Tap to add a fridge or pantry photo"}
              </button>
              {photoPreview && (
                <img src={photoPreview} alt="Your kitchen photo preview" className="mt-3 h-40 w-full rounded-2xl object-cover" />
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dietary" className="mb-2 block text-base font-bold text-gray-100">
                  Dietary needs (optional)
                </label>
                <input
                  id="dietary"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="vegetarian, gluten-free..."
                  className="w-full rounded-2xl border border-char-700 bg-char-950 px-4 py-3 text-base text-white placeholder-gray-500 outline-none focus:border-ember-500"
                />
              </div>
              <div>
                <label htmlFor="cals" className="mb-2 block text-base font-bold text-gray-100">
                  Calories per serving (optional)
                </label>
                <input
                  id="cals"
                  type="number"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full rounded-2xl border border-char-700 bg-char-950 px-4 py-3 text-base text-white placeholder-gray-500 outline-none focus:border-ember-500"
                />
              </div>
            </div>

            <label className="flex min-h-[48px] items-center gap-3 text-base text-gray-200">
              <input
                type="checkbox"
                checked={leftoversMode}
                onChange={(e) => setLeftoversMode(e.target.checked)}
                className="h-5 w-5 accent-ember-500"
              />
              These are leftovers I want to use up
            </label>

            {error && (
              <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-base text-red-300" role="alert">
                {error}
              </p>
            )}
            {remaining !== null && (
              <p className="text-base text-gray-400">
                {remaining} free recipe{remaining === 1 ? "" : "s"} left today on the free plan
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-ember w-full min-h-[56px] rounded-full py-4 text-lg font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Making recipes…" : "Make my recipes →"}
            </button>
            <p className="text-center text-sm text-gray-500">
              Free plan: {FREE_RECIPES_PER_DAY} recipes/day · No account · Results in seconds
            </p>
          </form>
        ) : (
          <form onSubmit={handleImport} className="space-y-5 rounded-3xl border border-char-700 bg-char-900 p-6 sm:p-7">
            <h1 className="font-display text-3xl font-bold text-white">Import a recipe</h1>
            <p className="text-base leading-relaxed text-gray-300">
              Paste a recipe link or the full text. We strip ads and clutter and give you clean steps.
            </p>
            <label htmlFor="import-input" className="block text-base font-bold text-gray-100">
              Link or recipe text
            </label>
            <textarea
              id="import-input"
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              placeholder="Paste a recipe URL or the full recipe text…"
              rows={6}
              className="w-full rounded-2xl border border-char-700 bg-char-950 px-4 py-3 text-base text-white placeholder-gray-500 outline-none focus:border-ember-500"
            />
            {error && (
              <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-base text-red-300" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-ember w-full min-h-[56px] rounded-full py-4 text-lg font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Cleaning up…" : "Import & clean up →"}
            </button>
          </form>
        )}
      </div>

      <div>
        {quotaBlocked && <UpgradePrompt reason={`You've used today's ${FREE_RECIPES_PER_DAY} free recipes`} />}
        {!quotaBlocked && !result && !importedRecipe && !loading && (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-char-700 bg-char-900/40 px-6 text-center">
            <span className="text-4xl" aria-hidden>
              🍳
            </span>
            <p className="max-w-sm text-lg font-semibold text-gray-200">Your recipes will show up here</p>
            <p className="max-w-sm text-base text-gray-400">
              Add ingredients on the left and press <strong className="text-white">Make my recipes</strong>. You can
              save favorites and use Hands-Free Mode while you cook.
            </p>
          </div>
        )}
        {loading && (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border border-char-700 bg-char-900/50 text-gray-200">
            <span className="flame-flicker text-4xl" aria-hidden>
              🔥
            </span>
            <p className="text-lg font-semibold">Cooking up ideas…</p>
            <p className="text-base text-gray-400">Usually under 15 seconds</p>
          </div>
        )}
        {result && (
          <div className="space-y-6">
            {result.detectedIngredients.length > 0 && (
              <div>
                <p className="mb-2 text-base font-bold text-white">We spotted these ingredients</p>
                <p className="mb-3 text-sm text-gray-400">Double-check for allergies before you cook.</p>
                <div className="flex flex-wrap gap-2">
                  {result.detectedIngredients.map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full bg-char-800 px-3 py-1.5 text-sm font-medium text-gray-200"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.recipes.map((r) => (
              <RecipeCard key={r.title} recipe={r} />
            ))}
          </div>
        )}
        {importedRecipe && (
          <div className="space-y-6">
            <RecipeCard recipe={importedRecipe} />
          </div>
        )}
      </div>
    </div>
  );
}
