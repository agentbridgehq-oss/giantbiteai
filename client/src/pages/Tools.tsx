import { useMemo, useState } from "react";
import { useGbaState } from "../lib/storage";
import type { Recipe } from "../lib/api";

const VOLUME_TO_ML: Record<string, number> = {
  tsp: 4.92892,
  tbsp: 14.7868,
  "fl oz": 29.5735,
  cup: 236.588,
  ml: 1,
  L: 1000,
};

const WEIGHT_TO_G: Record<string, number> = {
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
};

function UnitConverter() {
  const [category, setCategory] = useState<"volume" | "weight">("volume");
  const table = category === "volume" ? VOLUME_TO_ML : WEIGHT_TO_G;
  const units = Object.keys(table);
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState(units[0]);
  const [to, setTo] = useState(units[1]);

  const result = useMemo(() => {
    const n = parseFloat(amount);
    if (Number.isNaN(n)) return null;
    const base = n * (table[from] ?? 1);
    const converted = base / (table[to] ?? 1);
    return Math.round(converted * 1000) / 1000;
  }, [amount, from, to, table]);

  function switchCategory(next: "volume" | "weight") {
    setCategory(next);
    const u = Object.keys(next === "volume" ? VOLUME_TO_ML : WEIGHT_TO_G);
    setFrom(u[0]);
    setTo(u[1]);
  }

  return (
    <div className="rounded-2xl border border-char-800 bg-char-900 p-6">
      <h2 className="font-display text-lg font-bold text-white">Unit Converter</h2>
      <div className="mt-4 flex gap-1 rounded-full border border-char-800 bg-char-950 p-1">
        {(["volume", "weight"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => switchCategory(c)}
            className={`flex-1 rounded-full py-1.5 text-xs font-semibold capitalize transition ${
              category === c ? "btn-ember text-white" : "text-gray-400"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-end gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-20 rounded-xl border border-char-700 bg-char-950 px-3 py-2 text-sm text-white outline-none focus:border-ember-500"
        />
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-xl border border-char-700 bg-char-950 px-2 py-2 text-sm text-white outline-none focus:border-ember-500"
        >
          {units.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <span className="pb-2 text-gray-500">→</span>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-xl border border-char-700 bg-char-950 px-2 py-2 text-sm text-white outline-none focus:border-ember-500"
        >
          {units.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
      <p className="mt-4 text-2xl font-bold text-ember-400">{result ?? "—"} <span className="text-sm text-gray-400">{to}</span></p>
      <p className="mt-1 text-xs text-gray-500">Volume/weight conversions are exact. Cups-to-grams varies by ingredient density, so use a kitchen scale for baking precision.</p>
    </div>
  );
}

function parseAmount(amount: string): { value: number; rest: string } | null {
  const match = amount.trim().match(/^(\d+\s*\/\s*\d+|\d*\.?\d+)/);
  if (!match) return null;
  const numStr = match[1];
  const value = numStr.includes("/")
    ? numStr.split("/").map(Number).reduce((a, b) => a / b)
    : parseFloat(numStr);
  return { value, rest: amount.slice(match[0].length).trim() };
}

function scaleAmount(amount: string, ratio: number): string {
  const parsed = parseAmount(amount);
  if (!parsed) return amount;
  const scaled = Math.round(parsed.value * ratio * 100) / 100;
  return parsed.rest ? `${scaled} ${parsed.rest}` : `${scaled}`;
}

function RecipeScaler({ savedRecipes }: { savedRecipes: Recipe[] }) {
  const [selectedTitle, setSelectedTitle] = useState("");
  const [manualLines, setManualLines] = useState("");
  const [originalServings, setOriginalServings] = useState(4);
  const [targetServings, setTargetServings] = useState(4);

  const selected = savedRecipes.find((r) => r.title === selectedTitle);
  const lines = selected
    ? selected.ingredients.map((i) => `${i.amount} ${i.item}`)
    : manualLines.split("\n").filter(Boolean);

  const ratio = (selected ? selected.servings : originalServings) > 0
    ? targetServings / (selected ? selected.servings : originalServings)
    : 1;

  return (
    <div className="rounded-2xl border border-char-800 bg-char-900 p-6">
      <h2 className="font-display text-lg font-bold text-white">Recipe Scaler</h2>
      <p className="mt-1 text-sm text-gray-400">Scale any recipe up or down by servings.</p>

      {savedRecipes.length > 0 && (
        <select
          value={selectedTitle}
          onChange={(e) => setSelectedTitle(e.target.value)}
          className="mt-4 w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white outline-none focus:border-ember-500"
        >
          <option value="">Paste ingredients manually...</option>
          {savedRecipes.map((r) => (
            <option key={r.title} value={r.title}>{r.title}</option>
          ))}
        </select>
      )}

      {!selected && (
        <textarea
          value={manualLines}
          onChange={(e) => setManualLines(e.target.value)}
          placeholder={"2 cups flour\n1 tsp salt\n3 eggs"}
          rows={5}
          className="mt-3 w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-ember-500"
        />
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-300">Original servings</label>
          <input
            type="number"
            min={1}
            disabled={Boolean(selected)}
            value={selected ? selected.servings : originalServings}
            onChange={(e) => setOriginalServings(Number(e.target.value))}
            className="w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2 text-sm text-white outline-none focus:border-ember-500 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-300">Target servings</label>
          <input
            type="number"
            min={1}
            value={targetServings}
            onChange={(e) => setTargetServings(Number(e.target.value))}
            className="w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2 text-sm text-white outline-none focus:border-ember-500"
          />
        </div>
      </div>

      {lines.length > 0 && (
        <div className="mt-5 rounded-xl border border-char-800 bg-char-950 p-4">
          <h3 className="text-sm font-semibold text-white">Scaled ingredients ({ratio.toFixed(2)}×)</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-300">
            {lines.map((line, i) => (
              <li key={i}>• {scaleAmount(line, ratio)}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-gray-500">Amounts without a clear number (like "a pinch") are left as-is.</p>
        </div>
      )}
    </div>
  );
}

export default function Tools() {
  const state = useGbaState();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Kitchen Tools</h1>
        <p className="mt-1 text-sm text-gray-400">Quick utilities — instant, no quota used.</p>
      </div>
      <UnitConverter />
      <RecipeScaler savedRecipes={state.savedRecipes} />
    </div>
  );
}
