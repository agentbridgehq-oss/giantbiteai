import { useEffect, useState } from "react";
import { applyComfortToDom, getComfortPrefs, setComfortPrefs, type ComfortPrefs } from "../lib/comfort";

/** Persistent accessibility / comfort controls — 55+ and everyday users. */
export default function ComfortBar({ compact = false }: { compact?: boolean }) {
  const [prefs, setPrefs] = useState<ComfortPrefs>(() => getComfortPrefs());

  useEffect(() => {
    applyComfortToDom(prefs);
  }, [prefs]);

  function toggle(key: keyof ComfortPrefs) {
    const next = setComfortPrefs({ [key]: !prefs[key] });
    setPrefs(next);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => toggle("comfort")}
        className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
          prefs.comfort
            ? "border-ember-500 bg-ember-500/15 text-ember-400"
            : "border-char-700 bg-char-900 text-gray-300 hover:border-char-600 hover:text-white"
        }`}
        aria-pressed={prefs.comfort}
        title="Larger text and bigger buttons"
      >
        {prefs.comfort ? "Comfort: On" : "Comfort"}
      </button>
    );
  }

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-char-700 bg-char-900/90 px-3 py-2.5 shadow-lg backdrop-blur sm:justify-start"
      role="group"
      aria-label="Display comfort options"
    >
      <span className="hidden text-xs font-bold uppercase tracking-wider text-gray-500 sm:inline">Display</span>
      <button
        type="button"
        onClick={() => toggle("comfort")}
        className={`min-h-[44px] rounded-full border px-4 py-2 text-base font-semibold transition ${
          prefs.comfort
            ? "border-ember-500 bg-ember-500/20 text-white"
            : "border-char-700 text-gray-300 hover:border-char-600 hover:text-white"
        }`}
        aria-pressed={prefs.comfort}
      >
        {prefs.comfort ? "✓ Larger text" : "Larger text"}
      </button>
      <button
        type="button"
        onClick={() => toggle("highContrast")}
        className={`min-h-[44px] rounded-full border px-4 py-2 text-base font-semibold transition ${
          prefs.highContrast
            ? "border-ember-500 bg-ember-500/20 text-white"
            : "border-char-700 text-gray-300 hover:border-char-600 hover:text-white"
        }`}
        aria-pressed={prefs.highContrast}
      >
        {prefs.highContrast ? "✓ High contrast" : "High contrast"}
      </button>
      <button
        type="button"
        onClick={() => toggle("reduceMotion")}
        className={`min-h-[44px] rounded-full border px-4 py-2 text-base font-semibold transition ${
          prefs.reduceMotion
            ? "border-ember-500 bg-ember-500/20 text-white"
            : "border-char-700 text-gray-300 hover:border-char-600 hover:text-white"
        }`}
        aria-pressed={prefs.reduceMotion}
      >
        {prefs.reduceMotion ? "✓ Less motion" : "Less motion"}
      </button>
    </div>
  );
}
