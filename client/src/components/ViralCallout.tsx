import { Link } from "react-router-dom";

const ITEMS = [
  { emoji: "🔥", title: "Daily streaks", desc: "Cook once a day, keep the flame alive. Miss a day and it resets — just like Duolingo for your kitchen." },
  { emoji: "🏆", title: "Badges to flex", desc: "Leftover Hero, Fridge Scanner, Week of Fire — unlock badges and a shareable recipe card every time." },
  { emoji: "💸", title: "Real money saved", desc: "Every recipe tracks what it saved you vs. a takeout order or wasted groceries — your own running total." },
  { emoji: "🤝", title: "Invite your crew", desc: "Share your link, unlock Kitchen Crew status. No paywall to gate it behind — just bragging rights." },
];

export default function ViralCallout() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Built to brag about</h2>
          <p className="mt-3 text-gray-400">The fun parts other recipe apps skip.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {ITEMS.map((it) => (
            <div key={it.title} className="flex gap-4 rounded-2xl bg-char-900/40 p-5">
              <span className="text-2xl">{it.emoji}</span>
              <div>
                <h3 className="font-bold text-white">{it.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/dashboard" className="btn-ember inline-flex rounded-full px-7 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110">
            See your dashboard →
          </Link>
        </div>
      </div>
    </section>
  );
}
