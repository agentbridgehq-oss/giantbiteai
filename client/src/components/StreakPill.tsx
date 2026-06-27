import { useGbaState } from "../lib/storage";

export default function StreakPill() {
  const state = useGbaState();
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-char-700 bg-char-900 px-3 py-1.5 text-sm font-semibold text-slate-900">
      <span className={state.streak > 0 ? "flame-flicker" : "opacity-40"}>🔥</span>
      {state.streak}
    </div>
  );
}
