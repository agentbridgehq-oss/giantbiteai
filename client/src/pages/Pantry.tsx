import { useState } from "react";
import { Link } from "react-router-dom";
import { addPantryItem, removePantryItem, useGbaState } from "../lib/storage";

function daysUntil(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const diff = target.getTime() - todayMidnight().getTime();
  return Math.round(diff / 86400000);
}

function todayMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Pantry() {
  const state = useGbaState();
  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addPantryItem(name.trim(), expiresAt || null);
    setName("");
    setExpiresAt("");
  }

  const sorted = [...state.pantryItems].sort((a, b) => {
    if (!a.expiresAt && !b.expiresAt) return 0;
    if (!a.expiresAt) return 1;
    if (!b.expiresAt) return -1;
    return a.expiresAt.localeCompare(b.expiresAt);
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-white">My Pantry</h1>
      <p className="mt-1 text-sm text-gray-400">
        Track what you've got. The Recipe Generator can pull straight from this list.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 rounded-2xl border border-char-800 bg-char-900 p-5 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-semibold text-gray-300">Item</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. chicken thighs"
            className="w-full rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-ember-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-300">Expires (optional)</label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-white outline-none focus:border-ember-500"
          />
        </div>
        <button type="submit" className="btn-ember rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-glow">
          Add
        </button>
      </form>

      {sorted.length === 0 ? (
        <p className="mt-8 text-center text-sm text-gray-500">Your pantry is empty — add what you've got above.</p>
      ) : (
        <div className="mt-6 space-y-2">
          {sorted.map((item) => {
            const days = item.expiresAt ? daysUntil(item.expiresAt) : null;
            const urgent = days !== null && days <= 3;
            return (
              <div
                key={item.name}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  urgent ? "border-ember-500/40 bg-ember-500/5" : "border-char-800 bg-char-900"
                }`}
              >
                <div>
                  <span className="text-sm font-medium text-white">{item.name}</span>
                  {days !== null && (
                    <span className={`ml-2 text-xs ${urgent ? "text-ember-400" : "text-gray-500"}`}>
                      {days < 0 ? "expired" : days === 0 ? "expires today" : `expires in ${days}d`}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removePantryItem(item.name)}
                  className="text-xs text-gray-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      {sorted.length > 0 && (
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/cook" className="text-ember-400 hover:underline">
            Use this pantry in the Recipe Generator →
          </Link>
        </p>
      )}
    </div>
  );
}
