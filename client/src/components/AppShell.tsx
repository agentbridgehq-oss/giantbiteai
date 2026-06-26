import { NavLink, Outlet } from "react-router-dom";
import Logo from "./Logo";
import StreakPill from "./StreakPill";

const TABS = [
  { to: "/cook", label: "Cook", icon: "🍳" },
  { to: "/plan", label: "Plan", icon: "🗓️" },
  { to: "/coach", label: "Coach", icon: "💬" },
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
];

export default function AppShell() {
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
          </nav>
          <StreakPill />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
