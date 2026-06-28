export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div className="absolute -inset-10 -z-10 rounded-full bg-ember-500/20 blur-3xl" />
      <div className="rounded-[2.5rem] border border-char-700 bg-char-900 p-2 shadow-glow">
        <div className="rounded-[2rem] border border-char-800 bg-char-950 px-4 pb-5 pt-7">
          <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-char-700" />

          <p className="text-[11px] font-semibold uppercase tracking-wide text-ember-400">Recipe Generator</p>
          <h3 className="mt-1 font-display text-lg font-bold leading-tight text-white">Garlic Butter Chicken & Rice</h3>

          <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-gray-500">
            <span>⏱ 25 min</span>
            <span>🍽 2 servings</span>
            <span className="text-ember-400">💸 saved ~$11</span>
          </div>

          <div className="mt-4 space-y-1.5 rounded-xl border border-char-800 bg-char-900 p-3">
            <p className="text-[11px] font-semibold text-white">Ingredients</p>
            <p className="text-[11px] text-gray-400">• 2 chicken thighs</p>
            <p className="text-[11px] text-gray-400">• 1 cup rice</p>
            <p className="text-[11px] text-gray-400">• 2 tbsp butter, garlic</p>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-full border border-char-700 bg-char-900 px-3 py-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
            <p className="truncate text-[11px] text-gray-400">What can I make with chicken thighs?</p>
          </div>
        </div>
      </div>
    </div>
  );
}
