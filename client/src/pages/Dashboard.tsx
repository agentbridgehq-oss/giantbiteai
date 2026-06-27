import { useState } from "react";
import { BADGE_META, getTopTasteTags, recordInviteClick, useGbaState, type Badge } from "../lib/storage";
import { showToast } from "../lib/toast";
import RecipeCard from "../components/RecipeCard";

const ALL_BADGES = Object.keys(BADGE_META) as Badge[];

export default function Dashboard() {
  const state = useGbaState();
  const [copied, setCopied] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const referralUrl = `${window.location.origin}/?ref=${state.referralCode}`;
  const tasteTags = getTopTasteTags(state, 6);

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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">My Recipes ({state.savedRecipes.length})</h2>
          {state.savedRecipes.length > 0 && (
            <button type="button" onClick={() => setShowSaved((v) => !v)} className="text-sm text-ember-400 hover:underline">
              {showSaved ? "Hide" : "Show"}
            </button>
          )}
        </div>
        {state.savedRecipes.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">Tap "Save Recipe" on any result to build your collection here.</p>
        ) : (
          showSaved && (
            <div className="mt-4 space-y-6">
              {state.savedRecipes.map((r) => (
                <RecipeCard key={r.title} recipe={r} />
              ))}
            </div>
          )
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
