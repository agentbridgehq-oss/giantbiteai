import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, CalendarDays, MessageCircle, Carrot, Ruler, Wine, GraduationCap, type LucideIcon } from "lucide-react";

// lg uses an 8-col grid (cards span 2) so the 3 cards in row two can sit
// left / center / right, keeping the outer edges flush with the top row.
const FEATURES: { to: string; label: string; desc: string; icon: LucideIcon; lgPos?: string }[] = [
  { to: "/cook", label: "Recipe Generator", desc: "Turn what's on hand into a real dish", icon: ChefHat },
  { to: "/plan", label: "Meal Planner", desc: "A full week, plus the shopping list", icon: CalendarDays },
  { to: "/coach", label: "AI Coach", desc: "Live help while you're cooking", icon: MessageCircle },
  { to: "/pantry", label: "My Pantry", desc: "Track what you have, cut waste", icon: Carrot },
  { to: "/tools", label: "Kitchen Tools", desc: "Unit converter & recipe scaler", icon: Ruler, lgPos: "lg:col-start-1" },
  { to: "/pairing", label: "Drink Pairing", desc: "The right pour for any meal", icon: Wine, lgPos: "lg:col-start-4" },
  { to: "/academy", label: "Academy", desc: "Real lessons, not just recipes", icon: GraduationCap, lgPos: "lg:col-start-7" },
];

export default function FeatureGrid() {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState<string | null>(null);

  function open(to: string) {
    if (pressed) return;
    setPressed(to);
    setTimeout(() => navigate(to), 160);
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-8">
      {FEATURES.map(({ to, label, desc, icon: Icon, lgPos }) => (
        <button
          key={to}
          type="button"
          onClick={() => open(to)}
          className={`rounded-xl border border-white/5 bg-char-900 p-7 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-ember-500/30 hover:shadow-[0_0_40px_rgba(249,115,22,0.05)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-500/60 lg:col-span-2 ${lgPos ?? ""} ${
            pressed === to ? "opacity-70" : ""
          }`}
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ember-500/25"><Icon className="h-5 w-5 text-ember-400" strokeWidth={1.5} /></span>
          <p className="mt-4 font-display text-base font-bold text-white">{label}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{desc}</p>
        </button>
      ))}
    </div>
  );
}
