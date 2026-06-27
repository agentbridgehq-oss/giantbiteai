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
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <div className="space-y-5">
        <div className="flex gap-1 rounded-full border border-char-800 bg-char-900 p-1">
          <button
            type="button"
            onClick={() => setMode("ingredients")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${mode === "ingredients" ? "btn-ember text-white" : "text-gray-400"}`}
          >
            From Ingredients
          </button>
          <button
            type="button"
            onClick={() => setMode("import")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${mode === "import" ? "btn-ember text-white" : "text-gray-400"}`}
          >
            Import a Recipe
          </button>
        </div>

        {mode === "ingredients" ? (
          <form onSubmit={handleGenerate} className="space-y-5 rounded-2xl border border-char-800 bg-char-900 p-6">
            <h1 className="font-display text-2xl font-bold text-white">Recipe Generator</h1>
            <p className="text-sm text-gray-400">Type what you have, or snap your fridge/pantry.</p>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-300">Ingredients</label>
                {state.pantryItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIngredientsText(state.pantryItems.map((i) => i.name).join(", "))}
                    className="text-xs text-ember-400 hover:underline"
                  >
                    🧺 Use my pantry
                  </button>
                )}
              </div>
              <textarea
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="e.g. chicken thighs, half a bell pepper, rice, eggs..."
                rows={4}
                className="w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-ember-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-300">Or upload a photo</label>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
                aria-label="Upload a fridge or pantry photo"
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="w-full rounded-xl border border-dashed border-char-700 bg-char-950 px-3 py-4 text-sm text-gray-400 transition hover:border-ember-500 hover:text-white"
              >
                {photoPreview ? "📸 Photo attached — tap to replace" : "📸 Tap to add a fridge/pantry photo"}
              </button>
              {photoPreview && (
                <img src={photoPreview} alt="preview" className="mt-3 h-32 w-full rounded-xl object-cover" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-300">Dietary (optional)</label>
                <input
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="vegetarian, gluten-free..."
                  className="w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-ember-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-300">Cal/serving (optional)</label>
                <input
                  type="number"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-ember-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={leftoversMode} onChange={(e) => setLeftoversMode(e.target.checked)} className="h-4 w-4 accent-ember-500" />
              ♻️ These are leftovers I need to rescue
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {remaining !== null && (
              <p className="text-xs text-gray-500">{remaining} free recipe{remaining === 1 ? "" : "s"} left today</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-ember w-full rounded-full py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Generate Recipes"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleImport} className="space-y-5 rounded-2xl border border-char-800 bg-char-900 p-6">
            <h1 className="font-display text-2xl font-bold text-white">Import a Recipe</h1>
            <p className="text-sm text-gray-400">Paste a recipe URL, a YouTube link, or the raw text — we'll strip the ads (or transcribe the video) and clean it up.</p>
            <textarea
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or a recipe URL, or paste the recipe text..."
              rows={6}
              className="w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-ember-500"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-ember w-full rounded-full py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Cleaning up..." : "Import & Clean Up"}
            </button>
          </form>
        )}
      </div>

      <div>
        {quotaBlocked && <UpgradePrompt reason={`You've used today's ${FREE_RECIPES_PER_DAY} free recipes`} />}
        {!quotaBlocked && !result && !importedRecipe && !loading && (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-char-800 text-gray-500">
            Your recipes will show up here.
          </div>
        )}
        {loading && (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-char-800 text-gray-400">
            <span className="flame-flicker text-3xl">🔥</span>
            Cooking up ideas...
          </div>
        )}
        {result && (
          <div className="space-y-6">
            {result.detectedIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.detectedIngredients.map((ing) => (
                  <span key={ing} className="rounded-full bg-char-800 px-3 py-1 text-xs font-medium text-gray-300">
                    {ing}
                  </span>
                ))}
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
