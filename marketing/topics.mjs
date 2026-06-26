// Content pillars grounded in researched 2026 food-content trends:
// - waste/budget angle converts hardest in this niche (r/EatCheapAndHealthy ~2.4M members,
//   r/budgetfood) and is GiantBiteAI's core differentiator vs paywalled competitors
// - TikTok/Pinterest 2026 trend data: quick one-pan meals, high-protein comfort food,
//   global-inspired dishes, gut-health ingredients (kimchi, pickled onions, yogurt sauces)
// - "AI app goes silent once you start cooking" is the most-repeated competitor complaint —
//   own that gap directly with Coach-focused content
export const CONTENT_PILLARS = [
  {
    id: "leftover-rescue",
    angle: "What to cook with [leftover ingredient] before it goes bad",
    seo: "long-tail 'what to cook with X' searches",
    cta: "Try the free Leftover Rescue mode in the Recipe Generator",
    subreddits: ["EatCheapAndHealthy", "budgetfood", "Cooking"],
  },
  {
    id: "budget-meal-prep",
    angle: "A full week of meal prep for under $[budget] — plan + shopping list included",
    seo: "budget meal prep, cheap meal plan",
    cta: "Generate this exact plan free with the Meal Planner",
    subreddits: ["MealPrepSunday", "EatCheapAndHealthy"],
  },
  {
    id: "high-protein-comfort",
    angle: "High-protein, one-pan comfort food trending right now, made from pantry staples",
    seo: "high protein comfort food, one pan dinner",
    cta: "Get 3 variations instantly from whatever protein you already have",
    subreddits: ["Cooking", "slowcooking"],
  },
  {
    id: "gut-health",
    angle: "Easy gut-health additions (quick pickles, yogurt sauces, kimchi swaps) for meals you already make",
    seo: "gut health recipes, easy fermented sides",
    cta: "Ask the AI Coach for a gut-friendly swap on any recipe",
    subreddits: ["vegetarian", "Cooking"],
  },
  {
    id: "ai-coach-gap",
    angle: "Why every AI cooking app goes silent the moment you start cooking — and how to fix it",
    seo: "AI cooking assistant, real time recipe help",
    cta: "Try the AI Cooking Coach — the one tool every other app skipped",
    subreddits: ["Cooking", "AskCulinary"],
  },
  {
    id: "free-vs-paywall",
    angle: "We compared the price of every popular AI recipe app in 2026 (one of them is free forever)",
    seo: "free AI recipe app, AI cooking app comparison",
    cta: "See the full comparison and start free",
    subreddits: ["EatCheapAndHealthy", "Frugal"],
  },
  {
    id: "fridge-scan",
    angle: "I scanned my fridge with AI and got 3 real dinners — here's what actually worked",
    seo: "AI recipe from photo, fridge scanner app",
    cta: "Try the photo scanner free, no account needed",
    subreddits: ["Cooking", "MealPrepSunday"],
  },
];

export function seasonalHint(date = new Date()) {
  const month = date.getMonth();
  if (month >= 8 && month <= 10) return "It's early autumn — pumpkin, squash, and warm spices are searching well right now.";
  if (month >= 5 && month <= 7) return "It's summer — grilling, no-cook meals, and quick salads are searching well right now.";
  if (month === 11 || month === 0) return "It's the holiday/new-year window — budget resets and 'healthy on a budget' searches spike.";
  return "It's a normal week — lean on the evergreen budget and waste-reduction angle.";
}

export function pickTodaysPillar(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  return CONTENT_PILLARS[dayOfYear % CONTENT_PILLARS.length];
}
