import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Logo from "./Logo";
import StreakPill from "./StreakPill";
import ComfortBar from "./ComfortBar";
import { useGbaState } from "../lib/storage";

const TABS = [
  { to: "/cook", label: "Cook", icon: "🍳", hint: "Recipes" },
  { to: "/plan", label: "Plan", icon: "🗓️", hint: "Week meals" },
  { to: "/coach", label: "Coach", icon: "💬", hint: "Ask help" },
  { to: "/dashboard", label: "Home", icon: "📊", hint: "Your stats" },
];

const MORE_LINKS = [
  { to: "/pantry", label: "My Pantry", icon: "🧺" },
  { to: "/tools", label: "Kitchen Tools", icon: "📐" },
  { to: "/pairing", label: "Drink Pairing", icon: "🍷" },
  { to: "/academy", label: "Academy", icon: "🎓" },
  { to: "/pricing", label: "Plans & pricing", icon: "⭐" },
];

export default function AppShell() {
  const state = useGbaState();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="min-h-screen bg-char-950">
      <a href="#app-main" className="skip-link print:hidden">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-char-800 bg-char-950/95 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Logo to="/" />
          <nav
            className="order-3 flex w-full flex-wrap items-center justify-center gap-1 rounded-2xl border border-char-800 bg-char-900 p-1.5 sm:order-none sm:w-auto"
            aria-label="App sections"
          >
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                className={({ isActive }) =>
                  `flex min-h-[48px] items-center gap-2 rounded-xl px-3 py-2 text-base font-bold transition sm:px-4 ${
                    isActive ? "btn-ember text-white" : "text-gray-300 hover:text-white"
                  }`
                }
                title={t.hint}
              >
                <span aria-hidden>{t.icon}</span>
                <span>{t.label}</span>
              </NavLink>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                className="flex min-h-[48px] items-center gap-2 rounded-xl px-3 py-2 text-base font-bold text-gray-300 transition hover:text-white"
                aria-expanded={moreOpen}
                aria-haspopup="menu"
              >
                <span aria-hidden>⋯</span>
                <span>More</span>
              </button>
              {moreOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setMoreOpen(false)}
                  />
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-char-700 bg-char-900 p-2 shadow-xl"
                  >
                    {MORE_LINKS.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        role="menuitem"
                        onClick={() => setMoreOpen(false)}
                        className={({ isActive }) =>
                          `flex min-h-[48px] items-center gap-3 rounded-xl px-3 py-2 text-base font-semibold transition ${
                            isActive
                              ? "bg-ember-500/15 text-ember-400"
                              : "text-gray-200 hover:bg-char-800 hover:text-white"
                          }`
                        }
                      >
                        <span aria-hidden>{l.icon}</span>
                        {l.label}
                      </NavLink>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <ComfortBar compact />
            {state.tier !== "free" ? (
              <Link
                to="/pricing"
                className="min-h-[44px] rounded-full bg-char-800 px-4 py-2 text-sm font-bold text-ember-400"
              >
                ★ {state.tier === "pro" ? "Pro" : "Regular"}
              </Link>
            ) : (
              <Link
                to="/pricing"
                className="btn-ember min-h-[44px] rounded-full px-4 py-2 text-sm font-bold text-white"
              >
                Upgrade
              </Link>
            )}
            <StreakPill />
          </div>
        </div>
      </header>
      <main id="app-main" className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
