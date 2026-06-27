export interface WeeklyArticle {
  week: string;
  category: string;
  title: string;
  dek: string;
  minutes: number;
  body: string[];
}

export const WEEKLY_ARTICLE: WeeklyArticle = {
  week: "This week's read",
  category: "Kitchen Economics",
  title: "The Real Reason Your Grocery Bill Keeps Climbing — And It Isn't Inflation",
  dek: "It's not the price of eggs. It's the eleven dollars of produce dying in your crisper drawer right now.",
  minutes: 6,
  body: [
    "Here's an uncomfortable number: the average household throws out roughly a fifth of the food it buys. Not because the food was bad — because nobody had a plan for it before it turned. That bag of spinach seemed like a great idea on Sunday. By Thursday it's compost.",
    "The instinct is to blame prices. Eggs, beef, olive oil — they've all gone up, and that's real. But price increases explain maybe a third of why grocery spending feels unmanageable. The other two-thirds is simpler and far more fixable: most of us shop for the meals we imagine cooking, not the meals we actually cook.",
    "You buy cilantro for one recipe and use a tablespoon of it. You grab a rotisserie chicken \"for the week\" and eat it once before it goes grey at the edges. None of this is a discipline problem. It's a planning problem, and planning problems have planning solutions.",
    "Three changes make the biggest dent, in order of how much they actually move the needle:",
    "First — plan from what you already own, not from what looks good at the store. Open the fridge before you open a recipe site. The fastest way to do this without spending twenty minutes staring at vegetables is to keep a running list of what's in there with rough expiry dates, so the question \"what needs to get used\" answers itself instead of requiring memory.",
    "Second — build the week's meals around two or three ingredients that show up more than once. Buy a bunch of parsley once, use it across three dishes, instead of buying three different half-used herbs that each get used in one meal and then forgotten.",
    "Third — treat \"leftovers\" as its own category of cooking, not a consolation prize. The most expensive food in your kitchen is the food you already paid for and didn't eat. A genuinely good leftover-rescue meal is worth more to your budget than almost any coupon.",
    "None of this requires more willpower. It requires the planning step to take less effort than it currently does — because right now, for most people, it takes zero effort, which is exactly why it doesn't happen. That's the actual gap GiantBiteAI's Recipe Generator and My Pantry are built to close: tell it what's already in your kitchen, including the stuff that's about to turn, and it builds the meal around that instead of around an idealized grocery list.",
    "The eggs aren't the problem. The crisper drawer is.",
  ],
};
