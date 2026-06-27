import { useState } from "react";
import {
  BADGE_META,
  getTopTasteTags,
  recordInviteClick,
  reorderSavedRecipes,
  toggleSavedRecipe,
  setCalendarMeal,
  clearCalendarMeal,
  useGbaState,
  WEEK_DAYS,
  type Badge,
} from "../lib/storage";
import { showToast } from "../lib/toast";
import RecipeCard from "../components/RecipeCard";

const ALL_BADGES = Object.keys(BADGE_META) as Badge[];

export default function Dashboard() {
  const state = useGbaState();
  const [copied, setCopied] = useState(false);
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);
  const referralUrl = `${window.location.origin}/?ref=${state.referralCode}`;
  const tasteTags = getTopTasteTags(state, 6);

  function moveRecipe(index: number, delta: number) {
    const next = index + delta;
    if (next < 0 || next >= state.savedRecipes.length) return;
    reorderSavedRecipes(index, next);
  }

  function removeRecipe(title: string) {
    const recipe = state.savedRecipes.find((r) => r.title === title);
    if (recipe) toggleSavedRecipe(recipe);
    showToast("Removed from My Recipes");
  }

  function copyInvite() {
    navigator.clipboard.writeText(referralUrl);
    recordInviteClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareStats() {
    const text = `I've saved $${state.moneySavedUsd.toFixed(0)} and rescued ${state.mealsRescued} meals from the trash with GiantBiteAI — free AI cooking tools, no subscription. 🔥 ${state.streak}-day streak.`;
    if (navigator.share) {
      navigator.share({ title: "GiantBiteAI", text, url: referralUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${referralUrl}`);
      showToast("Copied to clipboard!");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold text-white">Your Dashboard</h1>
          {state.tier !== "free" && (
            <span className="rounded-full bg-ember-500/10 px-2.5 py-1 text-xs font-semibold text-ember-400">
              🎁 Founding {state.tier === "pro" ? "Pro" : "Member"}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400">Everything below lives only in this browser — no account needed.</p>
      </div>

      <div className="rounded-2xl border border-ember-500/30 bg-gradient-to-br from-ember-500/10 to-red-600/5 p-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat label="🔥 Day streak" value={state.streak} />
          <Stat label="🏅 Best streak" value={state.longestStreak} />
          <Stat label="💸 Money saved" value={`$${state.moneySavedUsd.toFixed(0)}`} />
          <Stat label="♻️ Meals rescued" value={state.mealsRescued} />
        </div>
        <button type="button" onClick={shareStats} className="mt-5 rounded-full border border-ember-500/50 px-4 py-2 text-xs font-semibold text-ember-300 transition hover:bg-ember-500/10">
          📤 Share my stats
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold text-white">Badges</h2>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {ALL_BADGES.map((b) => {
            const earned = state.badges.includes(b);
            return (
              <div
                key={b}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center ${
                  earned ? "border-ember-500/40 bg-ember-500/5" : "border-char-800 bg-char-900 opacity-40"
                }`}
              >
                <span className="text-2xl">{BADGE_META[b].emoji}</span>
                <span className="text-xs font-medium text-gray-300">{BADGE_META[b].label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {tasteTags.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white">Your Taste Profile</h2>
          <p className="text-sm text-gray-400">Built from what you've cooked — future recipes lean into this.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tasteTags.map((tag) => (
              <span key={tag} className="rounded-full bg-char-800 px-3 py-1.5 text-sm font-medium capitalize text-ember-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-white">My Recipes ({state.savedRecipes.length})</h2>
        {state.savedRecipes.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">Tap "Save Recipe" on any result to build your collection here.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {state.savedRecipes.map((r, i) => (
              <div key={r.title} className="rounded-xl border border-char-800 bg-char-900">
                <div className="flex items-center gap-3 p-4">
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveRecipe(i, -1)}
                      disabled={i === 0}
                      className="rounded border border-char-700 px-1.5 text-xs text-gray-400 disabled:opacity-30"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveRecipe(i, 1)}
                      disabled={i === state.savedRecipes.length - 1}
                      className="rounded border border-char-700 px-1.5 text-xs text-gray-400 disabled:opacity-30"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedTitle(expandedTitle === r.title ? null : r.title)}
                    className="flex-1 text-left"
                  >
                    <p className="text-sm font-semibold text-white">{r.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{expandedTitle === r.title ? "Tap to collapse" : "Tap to view full recipe"}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRecipe(r.title)}
                    className="shrink-0 rounded-full border border-char-700 px-3 py-1.5 text-xs text-gray-400 transition hover:border-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
                {expandedTitle === r.title && (
                  <div className="border-t border-char-800 p-4">
                    <RecipeCard recipe={r} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-white">Weekly Meal Calendar</h2>
        <p className="mt-1 text-sm text-gray-400">Assign a saved recipe to each day of the week.</p>
        {state.savedRecipes.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">Save a recipe first to start scheduling your week.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="flex items-center justify-between gap-3 rounded-xl border border-char-800 bg-char-900 p-3">
                <span className="w-24 shrink-0 text-sm font-semibold text-gray-300">{day}</span>
                <select
                  aria-label={`Meal for ${day}`}
                  value={state.mealCalendar[day] || ""}
                  onChange={(e) => (e.target.value ? setCalendarMeal(day, e.target.value) : clearCalendarMeal(day))}
                  className="flex-1 rounded-lg border border-char-700 bg-char-950 px-3 py-2 text-sm text-white outline-none focus:border-ember-500"
                >
                  <option value="">— none —</option>
                  {state.savedRecipes.map((r) => (
                    <option key={r.title} value={r.title}>{r.title}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-char-800 bg-char-900 p-6">
        <h2 className="text-lg font-bold text-white">Invite your kitchen crew</h2>
        <p className="mt-1 text-sm text-gray-400">
          No paywall to unlock — just bragging rights. Invite 3 friends to earn Kitchen Crew status.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            readOnly
            value={referralUrl}
            className="flex-1 rounded-xl border border-char-700 bg-char-950 px-3 py-2.5 text-sm text-gray-300"
          />
          <button type="button" onClick={copyInvite} className="btn-ember rounded-xl px-5 py-2.5 text-sm font-semibold text-white">
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">{state.inviteCount} invite link {state.inviteCount === 1 ? "copy" : "copies"} so far.</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
