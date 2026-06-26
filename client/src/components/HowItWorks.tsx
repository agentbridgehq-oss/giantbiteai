const STEPS = [
  { n: "01", title: "Show us what you've got", desc: "Snap your fridge or pantry, or just type a list. No barcode scanning, no setup." },
  { n: "02", title: "Get instant, real recipes", desc: "Real recipes (not generic filler) in under 10 seconds, built to use what's about to expire first." },
  { n: "03", title: "Cook with a coach, build a streak", desc: "Ask the AI Coach anything mid-recipe, then watch your streak, badges, and money saved stack up on your dashboard." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-char-900/40 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">How it works</h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n}>
              <span className="font-display text-4xl font-bold text-ember-500/40">{s.n}</span>
              <h3 className="mt-3 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
