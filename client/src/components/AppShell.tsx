import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Logo from "./Logo";
import StreakPill from "./StreakPill";
import { useGbaState } from "../lib/storage";

const TABS = [
  { to: "/cook", label: "Cook", icon: "🍳" },
  { to: "/plan", label: "Plan", icon: "🗓️" },
  { to: "/coach", label: "Coach", icon: "💬" },
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
];

const MORE_LINKS = [
  { to: "/pantry", label: "My Pantry", icon: "🧺" },
  { to: "/tools", label: "Kitchen Tools", icon: "📐" },
  { to: "/pairing", label: "Drink Pairing", icon: "🍷" },
  { to: "/academy", label: "Academy", icon: "🎓" },
];

export default function AppShell() {
  const state = useGbaState();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="min-h-screen bg-char-950">
      <header className="sticky top-0 z-40 border-b border-char-800 bg-char-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo to="/" />
          <nav className="flex items-center gap-1 rounded-full border border-char-800 bg-char-900 p-1">
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    isActive ? "btn-ember text-white" : "text-gray-400 hover:text-white"
                  }`
                }
              >
                <span>{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </NavLink>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-gray-400 transition hover:text-white"
              >
                <span>⋯</span>
                <span className="hidden sm:inline">More</span>
              </button>
              {moreOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setMoreOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-char-800 bg-char-900 p-1.5 shadow-lg">
                    {MORE_LINKS.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        onClick={() => setMoreOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                            isActive ? "bg-ember-500/10 text-ember-400" : "text-gray-300 hover:bg-char-800 hover:text-white"
                          }`
                        }
                      >
                        <span>{l.icon}</span>
                        {l.label}
                      </NavLink>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>
          <div className="flex items-center gap-2">
            {state.tier !== "free" ? (
              <Link to="/pricing" className="rounded-full bg-char-800 px-3 py-1.5 text-xs font-semibold text-ember-400">
                ★ {state.tier === "pro" ? "Pro" : "Regular"}
              </Link>
            ) : (
              <Link to="/pricing" className="btn-ember rounded-full px-3 py-1.5 text-xs font-semibold text-white">
                Upgrade
              </Link>
            )}
            <StreakPill />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
