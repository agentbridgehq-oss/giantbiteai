import { useEffect, useState } from "react";
import type { Recipe } from "./api";

export type Badge =
  | "first_recipe"
  | "first_scan"
  | "leftover_hero"
  | "planner_pro"
  | "streak_3"
  | "streak_7"
  | "streak_30"
  | "inviter_1"
  | "inviter_3"
  | "pantry_started";

export const BADGE_META: Record<Badge, { label: string; emoji: string }> = {
  first_recipe: { label: "First Recipe", emoji: "🍳" },
  first_scan: { label: "Fridge Scanner", emoji: "📸" },
  leftover_hero: { label: "Leftover Hero", emoji: "♻️" },
  planner_pro: { label: "Planner Pro", emoji: "🗓️" },
  streak_3: { label: "3-Day Streak", emoji: "🔥" },
  streak_7: { label: "Week of Fire", emoji: "🔥" },
  streak_30: { label: "Forged in Flame", emoji: "🔥" },
  inviter_1: { label: "Brought a Friend", emoji: "🤝" },
  inviter_3: { label: "Kitchen Crew", emoji: "👥" },
  pantry_started: { label: "Pantry Stocked", emoji: "🧺" },
};

export interface PantryItem {
  name: string;
  addedAt: string;
  expiresAt: string | null;
}

interface StateShape {
  streak: number;
  lastActiveDate: string | null;
  longestStreak: number;
  badges: Badge[];
  moneySavedUsd: number;
  mealsRescued: number;
  recipesGenerated: number;
  plansGenerated: number;
  referralCode: string;
  referredBy: string | null;
  inviteCount: number;
  tasteTags: Record<string, number>;
  isPro: boolean;
  usageDate: string | null;
  recipesToday: number;
  weekStart: string | null;
  plansThisWeek: number;
  freeCoachMessagesUsed: number;
  savedRecipes: Recipe[];
  pantryItems: PantryItem[];
}

export const FREE_COACH_MESSAGES = 2;

export const FREE_RECIPES_PER_DAY = 3;
export const FREE_PLANS_PER_WEEK = 1;
export const PRO_PRICE_MONTHLY = 7.99;
export const PRO_PRICE_YEARLY = 69;

const TASTE_KEYWORDS = [
  "italian", "mexican", "asian", "chinese", "japanese", "thai", "indian", "mediterranean", "greek", "french",
  "spicy", "creamy", "grilled", "roasted", "baked", "fried", "soup", "salad", "pasta", "rice", "noodles",
  "chicken", "beef", "pork", "fish", "shrimp", "tofu", "vegetarian", "vegan", "egg", "cheese", "beans",
];

export function extractTasteTags(text: string): string[] {
  const lower = text.toLowerCase();
  return TASTE_KEYWORDS.filter((kw) => lower.includes(kw));
}

const KEY = "giantbiteai_state_v1";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function defaultState(): StateShape {
  return {
    streak: 0,
    lastActiveDate: null,
    longestStreak: 0,
    badges: [],
    moneySavedUsd: 0,
    mealsRescued: 0,
    recipesGenerated: 0,
    plansGenerated: 0,
    referralCode: randomCode(),
    referredBy: null,
    inviteCount: 0,
    tasteTags: {},
    isPro: false,
    usageDate: null,
    recipesToday: 0,
    weekStart: null,
    plansThisWeek: 0,
    freeCoachMessagesUsed: 0,
    savedRecipes: [],
    pantryItems: [],
  };
}

function isoWeekStart(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

function syncUsageWindow(state: StateShape) {
  const today = todayStr();
  if (state.usageDate !== today) {
    state.usageDate = today;
    state.recipesToday = 0;
  }
  const weekStart = isoWeekStart(new Date());
  if (state.weekStart !== weekStart) {
    state.weekStart = weekStart;
    state.plansThisWeek = 0;
  }
  return state;
}

export function canGenerateRecipe(state: StateShape): boolean {
  if (state.isPro) return true;
  syncUsageWindow(state);
  return state.recipesToday < FREE_RECIPES_PER_DAY;
}

export function canGeneratePlan(state: StateShape): boolean {
  if (state.isPro) return true;
  syncUsageWindow(state);
  return state.plansThisWeek < FREE_PLANS_PER_WEEK;
}

export function consumeRecipeUsage() {
  const state = getState();
  syncUsageWindow(state);
  if (!state.isPro) state.recipesToday += 1;
  saveState(state);
  return state;
}

export function consumePlanUsage() {
  const state = getState();
  syncUsageWindow(state);
  if (!state.isPro) state.plansThisWeek += 1;
  saveState(state);
  return state;
}

export function canUseCoach(state: StateShape): boolean {
  return state.isPro || state.freeCoachMessagesUsed < FREE_COACH_MESSAGES;
}

export function consumeCoachMessage() {
  const state = getState();
  if (!state.isPro) state.freeCoachMessagesUsed += 1;
  saveState(state);
  return state;
}

export function isRecipeSaved(title: string): boolean {
  return getState().savedRecipes.some((r) => r.title === title);
}

export function toggleSavedRecipe(recipe: Recipe): boolean {
  const state = getState();
  const exists = state.savedRecipes.some((r) => r.title === recipe.title);
  state.savedRecipes = exists
    ? state.savedRecipes.filter((r) => r.title !== recipe.title)
    : [recipe, ...state.savedRecipes];
  saveState(state);
  return !exists;
}

export function addPantryItem(name: string, expiresAt: string | null) {
  const state = getState();
  state.pantryItems = [{ name, addedAt: todayStr(), expiresAt }, ...state.pantryItems];
  awardBadge(state, "pantry_started", true);
  saveState(state);
  return state;
}

export function removePantryItem(name: string) {
  const state = getState();
  state.pantryItems = state.pantryItems.filter((i) => i.name !== name);
  saveState(state);
  return state;
}

export function setPro(value: boolean) {
  const state = getState();
  state.isPro = value;
  saveState(state);
  return state;
}

export function getState(): StateShape {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seedAndSave();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return seedAndSave();
  }
}

function seedAndSave() {
  const s = defaultState();
  saveState(s);
  return s;
}

export function saveState(state: StateShape) {
  window.localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("gba:state", { detail: state }));
}

export function touchDailyStreak(): StateShape {
  const state = getState();
  const today = todayStr();
  if (state.lastActiveDate === today) return state;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  state.streak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
  state.lastActiveDate = today;
  state.longestStreak = Math.max(state.longestStreak, state.streak);

  awardBadge(state, "streak_3", state.streak >= 3);
  awardBadge(state, "streak_7", state.streak >= 7);
  awardBadge(state, "streak_30", state.streak >= 30);

  saveState(state);
  return state;
}

function awardBadge(state: StateShape, badge: Badge, condition: boolean) {
  if (condition && !state.badges.includes(badge)) state.badges.push(badge);
}

export function recordRecipeGenerated(
  moneySavedUsd: number,
  isLeftovers: boolean,
  usedPhoto: boolean,
  tasteText = ""
) {
  const state = getState();
  state.recipesGenerated += 1;
  state.moneySavedUsd += Math.max(0, moneySavedUsd);
  if (isLeftovers) state.mealsRescued += 1;

  for (const tag of extractTasteTags(tasteText)) {
    state.tasteTags[tag] = (state.tasteTags[tag] || 0) + 1;
  }

  awardBadge(state, "first_recipe", true);
  if (usedPhoto) awardBadge(state, "first_scan", true);
  if (isLeftovers) awardBadge(state, "leftover_hero", true);

  saveState(state);
  return state;
}

export function getTopTasteTags(state: StateShape, n = 5): string[] {
  return Object.entries(state.tasteTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([tag]) => tag);
}

export function recordPlanGenerated(estWeeklyCostUsd: number) {
  const state = getState();
  state.plansGenerated += 1;
  awardBadge(state, "planner_pro", true);
  saveState(state);
  return state;
}

export function registerReferral(code: string) {
  const state = getState();
  if (!state.referredBy && code && code !== state.referralCode) {
    state.referredBy = code;
    saveState(state);
  }
  return state;
}

export function recordInviteClick() {
  const state = getState();
  state.inviteCount += 1;
  awardBadge(state, "inviter_1", state.inviteCount >= 1);
  awardBadge(state, "inviter_3", state.inviteCount >= 3);
  saveState(state);
  return state;
}

export function useGbaState(): StateShape {
  const [state, setState] = useState<StateShape>(() => getState());

  useEffect(() => {
    const handler = () => setState(getState());
    window.addEventListener("gba:state", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("gba:state", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return state;
}
