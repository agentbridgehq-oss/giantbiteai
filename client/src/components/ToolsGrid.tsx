import { Link } from "react-router-dom";

const TOOLS = [
  {
    to: "/cook",
    emoji: "🍳",
    title: "Recipe Generator",
    desc: "Type what's in your kitchen or snap a photo of your fridge. AI identifies the ingredients and turns them into 3 real recipes in seconds — leftovers included.",
    tag: "Photo + text input",
  },
  {
    to: "/plan",
    emoji: "🗓️",
    title: "Meal Planner",
    desc: "Get a full 7-day plan built around your budget and goals, with a shopping list that reuses ingredients across days so nothing goes to waste.",
    tag: "Auto shopping list",
  },
  {
    to: "/coach",
    emoji: "💬",
    title: "AI Cooking Coach",
    desc: "Mid-recipe and stuck? Talk to it — tap the mic, ask out loud, hear the answer back. Substitutions, safe temps, timing fixes. The thing every other cooking app goes silent on.",
    tag: "Live while you cook",
  },
];

export default function ToolsGrid() {
  return (
    <section id="tools" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">Three tools. Zero friction.</h2>
          <p className="mt-3 text-slate-500">Fast, instant results, with no signup wall.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group flex flex-col rounded-2xl border border-char-800 bg-char-900 p-6 transition hover:-translate-y-1 hover:border-ember-500/50 hover:shadow-glow"
            >
              <span className="text-3xl">{tool.emoji}</span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{tool.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{tool.desc}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="rounded-full bg-char-800 px-3 py-1 text-xs font-medium text-slate-500">{tool.tag}</span>
                <span className="text-ember-400 transition group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
