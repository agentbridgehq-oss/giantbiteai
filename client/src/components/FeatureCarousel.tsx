import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
  { to: "/cook", emoji: "🍳", title: "Recipe Generator", desc: "Type what's in your kitchen or snap a fridge photo — get 3 real recipes in seconds." },
  { to: "/plan", emoji: "🗓️", title: "Meal Planner", desc: "A full 7-day plan with an auto-built shopping list that reuses ingredients to cut waste." },
  { to: "/coach", emoji: "💬", title: "AI Cooking Coach", desc: "Stuck mid-recipe? Ask out loud and get a real answer — substitutions, temps, timing." },
];

export default function FeatureCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <div className="mx-auto mt-10 max-w-md">
      <Link
        to={slide.to}
        className="block rounded-2xl border border-char-800 bg-char-900/80 p-6 text-left transition hover:border-ember-500/50"
      >
        <span className="text-3xl">{slide.emoji}</span>
        <h3 className="mt-3 text-lg font-bold text-white">{slide.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">{slide.desc}</p>
      </Link>
      <div className="mt-4 flex justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.to}
            type="button"
            aria-label={`Show ${s.title}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-ember-500" : "w-1.5 bg-char-700"}`}
          />
        ))}
      </div>
    </div>
  );
}
