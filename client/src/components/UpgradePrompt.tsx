import { Link } from "react-router-dom";

export default function UpgradePrompt({ reason }: { reason: string }) {
  return (
    <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border border-ember-500/30 bg-gradient-to-br from-ember-500/10 to-red-600/5 p-8 text-center">
      <span className="text-3xl">🔒</span>
      <p className="font-display text-lg font-bold text-white">{reason}</p>
      <p className="max-w-sm text-sm text-gray-400">
        Upgrade to GiantBiteAI Pro for unlimited recipes, unlimited meal plans, and full access to the AI Cooking Coach.
      </p>
      <Link
        to="/pricing"
        className="btn-ember mt-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
      >
        See Pro pricing →
      </Link>
    </div>
  );
}
