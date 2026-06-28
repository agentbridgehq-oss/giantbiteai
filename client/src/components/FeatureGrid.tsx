import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, CalendarDays, MessageCircle, Carrot, Ruler, Wine, GraduationCap, type LucideIcon } from "lucide-react";

const FEATURES: { to: string; label: string; desc: string; icon: LucideIcon }[] = [
  { to: "/cook", label: "Recipe Generator", desc: "Turn what's on hand into a real dish", icon: ChefHat },
  { to: "/plan", label: "Meal Planner", desc: "A full week, plus the shopping list", icon: CalendarDays },
  { to: "/coach", label: "AI Coach", desc: "Live help while you're cooking", icon: MessageCircle },
  { to: "/pantry", label: "My Pantry", desc: "Track what you have, cut waste", icon: Carrot },
  { to: "/tools", label: "Kitchen Tools", desc: "Unit converter & recipe scaler", icon: Ruler },
  { to: "/pairing", label: "Drink Pairing", desc: "The right pour for any meal", icon: Wine },
  { to: "/academy", label: "Academy", desc: "Real lessons, not just recipes", icon: GraduationCap },
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {FEATURES.map(({ to, label, desc, icon: Icon }) => (
        <button
          key={to}
          type="button"
          onClick={() => open(to)}
          className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-char-800/40 p-5 text-left backdrop-blur-xl transition-all duration-200 ease-out hover:-translate-y-1 hover:border-ember-500/50 hover:bg-char-700/60 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-500/60 ${
            pressed === to ? "scale-95 opacity-80" : "scale-100"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          <Icon className="h-6 w-6 text-ember-400 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.75} />
          <p className="mt-3 text-sm font-semibold text-white">{label}</p>
          <p className="mt-1 text-xs leading-snug text-gray-400">{desc}</p>
        </button>
      ))}
    </div>
  );
}
