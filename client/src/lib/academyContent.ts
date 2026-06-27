export interface Lesson {
  id: string;
  track: string;
  title: string;
  minutes: number;
  summary: string;
  body: string[];
}

export const TRACKS = ["Cooking Fundamentals", "Flavor & Technique", "Nutrition Basics"];

export const LESSONS: Lesson[] = [
  {
    id: "knife-skills",
    track: "Cooking Fundamentals",
    title: "Knife Skills That Actually Matter",
    minutes: 6,
    summary: "The 4 cuts that cover 90% of home cooking, and the grip that keeps you safe.",
    body: [
      "You don't need a knife set or a culinary-school class — you need four cuts and one grip.",
      "The grip: pinch the blade between thumb and index finger right where it meets the handle (the 'pinch grip'). Your other hand curls into a claw on the food, knuckles forward, guiding the knife against your first knuckle. This is the single biggest safety upgrade you can make today.",
      "Dice: cut the food into planks, then strips, then crosswise into cubes. Used for onions, peppers, potatoes — anything going into a sauté or stew.",
      "Mince: like dicing but much smaller and less precise — for garlic, ginger, herbs. Rock the knife tip-down, pivoting the back of the blade.",
      "Chiffonade: stack leafy herbs or greens, roll tightly, slice into thin ribbons. Used for basil, mint, lettuce.",
      "Rough chop: no precision needed, just roughly even pieces — for things going into a blender or stock.",
      "Keep your knife actually sharp. A dull knife requires more force, which is what causes slips and cuts — sharpness is a safety feature, not a luxury.",
    ],
  },
  {
    id: "heat-control",
    track: "Cooking Fundamentals",
    title: "Heat Control & Picking the Right Pan",
    minutes: 7,
    summary: "Why most home cooking goes wrong at the stove, not in the recipe.",
    body: [
      "Most 'I followed the recipe and it still came out wrong' problems are heat problems, not recipe problems.",
      "Cast iron and carbon steel hold heat and develop great sears, but are slow to change temperature — good for steaks, searing, blackening.",
      "Stainless steel is responsive and great for sauces (you can build a pan sauce in it, unlike non-stick), but needs enough oil/fat to prevent sticking.",
      "Non-stick is for delicate things — eggs, fish skin, pancakes — and should never be used on high heat (it degrades the coating).",
      "The 'water test' for stainless steel: heat the dry pan, flick in a few drops of water. If they skitter around like mercury, the pan is ready. If they sizzle and vanish immediately, it's too hot. If they just sit there, it's not hot enough yet.",
      "Preheat before adding fat in most cases — a cold pan with oil sitting in it is how food ends up stuck and gray instead of seared and browned.",
    ],
  },
  {
    id: "pantry-basics",
    track: "Cooking Fundamentals",
    title: "Building a Pantry That Always Has Dinner In It",
    minutes: 5,
    summary: "The short list of staples that turns 'nothing to eat' into a real meal.",
    body: [
      "A well-stocked pantry means you're never more than 20 minutes from a real dinner, even on a day you didn't plan for one.",
      "Aromatics: onion, garlic, ginger. These are the base of more cuisines than anything else you'll buy.",
      "Acid: lemon, vinegar (white, rice, balsamic). A dish that tastes 'flat' is almost always missing acid, not salt.",
      "Fat: a neutral oil for cooking, a good olive oil for finishing, butter for richness.",
      "A starch you actually like: rice, pasta, or potatoes — whichever you'll reliably reach for.",
      "A protein that keeps: eggs, canned beans, canned fish, or frozen chicken thighs.",
      "One umami booster: soy sauce, fish sauce, or parmesan rind. A small splash turns bland into savory.",
      "This is exactly what the Recipe Generator's pantry mode is built around — stock these and you'll almost always have something to put in.",
    ],
  },
  {
    id: "flavor-pillars",
    track: "Flavor & Technique",
    title: "The 5 Flavor Pillars",
    minutes: 6,
    summary: "Salt, fat, acid, heat, and umami — and how to balance them on the fly.",
    body: [
      "Every dish that tastes 'off' is missing one of five things: salt, fat, acid, heat (spice), or umami.",
      "Salt makes other flavors more perceptible — it's not just 'salty,' it's a volume knob for everything else. Season in layers, while cooking, not just at the end.",
      "Fat carries flavor and creates mouthfeel — a sauce 'broken' or thin usually needs a knob of butter or a drizzle of oil whisked in off the heat.",
      "Acid (citrus, vinegar) cuts richness and brightens a dish — taste a rich dish and ask 'does this need a squeeze of lemon?' more often than you think.",
      "Heat (chili, pepper) adds dimension, not just spiciness — a small amount sharpens flavors even if you don't want it 'spicy.'",
      "Umami (savoriness — soy, parmesan, mushrooms, tomato paste, fish sauce) is the pillar people forget, and it's often the fix for 'tastes like nothing.'",
      "When something tastes wrong, taste it and ask which of the five is missing before you reach for more of everything.",
    ],
  },
  {
    id: "maillard",
    track: "Flavor & Technique",
    title: "Searing and the Maillard Reaction",
    minutes: 5,
    summary: "Why browning = flavor, and the 3 mistakes that stop it from happening.",
    body: [
      "Browning isn't just visual — the Maillard reaction (browning) creates hundreds of new flavor compounds that don't exist in raw food. It's the difference between 'cooked' and 'delicious.'",
      "Mistake 1: a wet surface. Pat meat and vegetables dry before they hit the pan — water has to boil off before browning can start, which steals your heat and steams instead of sears.",
      "Mistake 2: overcrowding the pan. Too much food drops the pan's temperature and traps steam, so everything boils in its own juice instead of browning. Cook in batches if needed.",
      "Mistake 3: moving it too soon. Let food sit undisturbed long enough to actually form a crust before flipping or stirring — constant poking prevents browning from ever finishing.",
      "Don't season with sugar-heavy marinades right before high heat unless you want char, not a sear — sugar burns far below the temperature meat needs to brown properly.",
    ],
  },
  {
    id: "pan-sauces",
    track: "Flavor & Technique",
    title: "Building a Sauce From Pan Drippings",
    minutes: 6,
    summary: "Turn the brown bits stuck to the pan into a real sauce in under 5 minutes.",
    body: [
      "Those browned bits stuck to the pan after searing meat (the 'fond') are concentrated flavor — don't wash them away, build a sauce from them.",
      "Step 1 — deglaze: with the pan still hot, add a splash of liquid (wine, broth, even water) and scrape with a spatula. The fond will lift and dissolve into the liquid.",
      "Step 2 — reduce: let it simmer and reduce by about half to concentrate the flavor.",
      "Step 3 — enrich: off the heat, whisk in a knob of cold butter (this is called a 'beurre monté' move) for shine and body, or a splash of cream for richness.",
      "Step 4 — finish: a squeeze of lemon or a pinch of salt at the very end, tasted and adjusted.",
      "This single technique upgrades almost any seared meat or vegetable from 'fine' to 'restaurant-ish' with zero extra ingredients beyond what's already in the pan.",
    ],
  },
  {
    id: "macros-explained",
    track: "Nutrition Basics",
    title: "Macronutrients Explained Simply",
    minutes: 6,
    summary: "Protein, carbs, and fat — what they actually do, without the diet-culture noise.",
    body: [
      "Protein (4 calories/gram) builds and repairs muscle and tissue, and keeps you fuller longer than carbs or fat alone. Good sources: meat, fish, eggs, dairy, beans, tofu.",
      "Carbohydrates (4 calories/gram) are your body's preferred quick energy source. Whole sources (vegetables, fruit, whole grains, legumes) bring fiber and micronutrients along with the energy; refined sources (white bread, sugary drinks) don't.",
      "Fat (9 calories/gram) is essential for hormone function and vitamin absorption (A, D, E, K need fat to be absorbed at all). Unsaturated fats (olive oil, nuts, fish) are generally favored over heavily processed saturated/trans fats.",
      "There's no single 'correct' macro split for everyone — needs vary by body size, activity level, and goals. The more useful habit than counting exactly is making sure most meals have a visible source of all three.",
      "A simple plate rule: roughly a palm of protein, a fist of carbs, a thumb of fat, and the rest vegetables — no app or scale required.",
    ],
  },
  {
    id: "nutrition-labels",
    track: "Nutrition Basics",
    title: "Reading Nutrition Labels Without Getting Confused",
    minutes: 5,
    summary: "The 3 numbers that actually matter, and the marketing claims that don't.",
    body: [
      "Start with the serving size — every other number on the label is relative to it, and it's often smaller than what people actually eat in one sitting.",
      "Check the ingredient list, not just the nutrition panel — ingredients are listed by weight, so what's listed first is what there's the most of.",
      "Added sugar (not just 'sugar' — many labels now separate this out) is worth tracking; naturally occurring sugar in plain fruit or dairy is a different thing nutritionally.",
      "Fiber is one of the most underrated numbers on the label — it slows digestion, helps fullness, and most people don't get enough of it.",
      "Front-of-package claims ('natural,' 'lightly sweetened,' 'made with real fruit') are marketing, not regulated nutrition facts — the actual panel and ingredient list are the source of truth.",
    ],
  },
  {
    id: "eating-on-budget",
    track: "Nutrition Basics",
    title: "Eating Well on a Budget",
    minutes: 6,
    summary: "Nutrition and cost aren't actually opposites — here's where they overlap.",
    body: [
      "Dried and canned beans/lentils are some of the cheapest protein and fiber sources that exist, and they store almost indefinitely.",
      "Frozen vegetables are nutritionally comparable to fresh (often picked and frozen at peak ripeness) and dramatically reduce waste from things going bad before you use them.",
      "Eggs remain one of the best cost-per-gram-of-protein foods available, and they work for every meal of the day.",
      "Buying whole cuts (a whole chicken, a pork shoulder) and breaking them down yourself is consistently cheaper per serving than pre-cut portions.",
      "Planning meals around what's already about to expire (exactly what GiantBiteAI's leftovers mode and Pantry tracker are built for) is one of the highest-leverage ways to cut grocery spend without changing what you eat.",
    ],
  },
];
