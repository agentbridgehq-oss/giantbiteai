import { Link } from "react-router-dom";

const TOOLS = [
  {
    to: "/cook",
    emoji: "🍳",
    title: "Recipe Generator",
    desc: "Type what is in your kitchen or snap a fridge photo. Get real recipes in seconds — including leftovers rescue so food does not go to waste.",
    tag: "Photo + text",
    cta: "Make a recipe",
  },
  {
    to: "/plan",
    emoji: "🗓️",
    title: "Meal Planner",
    desc: "A clear week of meals plus a shopping list that reuses ingredients across days. Less waste. Fewer “what’s for dinner?” nights.",
    tag: "Shopping list included",
    cta: "Plan my week",
  },
  {
    to: "/coach",
    emoji: "💬",
    title: "Cooking Coach",
    desc: "Stuck mid-recipe? Ask out loud or type: substitutions, safe temps, timing. The moment other cooking apps go silent — we stay with you.",
    tag: "Help while you cook",
    cta: "Ask the coach",
  },
];

export default function ToolsGrid() {
  return (
    <section id="tools" className="px-4 py-20" aria-labelledby="tools-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-ember-400">What you get</p>
          <h2 id="tools-heading" className="gba-section-title mt-3 font-display text-3xl sm:text-4xl md:text-5xl">
            Three tools that actually finish the job
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Competitors stop at a pretty recipe card. GiantBiteAI walks you from fridge → plan → hands-free cooking help.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group flex flex-col rounded-3xl border border-char-700 bg-char-900 p-7 transition hover:-translate-y-1 hover:border-ember-500/50 hover:shadow-glow"
            >
              <span className="text-4xl" aria-hidden>
                {tool.emoji}
              </span>
              <h3 className="mt-5 text-xl font-bold text-white">{tool.title}</h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-gray-300">{tool.desc}</p>
              <div className="mt-6 flex items-center justify-between gap-3">
                <span className="rounded-full bg-char-800 px-3 py-1.5 text-sm font-semibold text-gray-300">
                  {tool.tag}
                </span>
                <span className="text-base font-bold text-ember-400 transition group-hover:translate-x-1">
                  {tool.cta} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
