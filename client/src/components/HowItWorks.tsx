const STEPS = [
  {
    n: "1",
    title: "Tell us what you have",
    desc: "Type a few ingredients, or take a photo of your fridge or pantry. No complicated setup. No barcode hunting.",
  },
  {
    n: "2",
    title: "Pick a clear recipe",
    desc: "Get practical recipes with ingredients and steps you can follow. Built to use what you already bought — less waste, less stress.",
  },
  {
    n: "3",
    title: "Cook with help nearby",
    desc: "Use Hands-Free Mode to hear the next step. Ask the Coach if you need a substitute, a temperature, or a timing tip.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-char-900/50 px-4 py-20" aria-labelledby="how-heading">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-ember-400">Three easy steps</p>
          <h2 id="how-heading" className="gba-section-title mt-3 font-display text-3xl sm:text-4xl md:text-5xl">
            How GiantBiteAI works
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Designed so anyone can start in under a minute — including first-time app users and cooks 55+.
          </p>
        </div>
        <ol className="mt-14 grid list-none gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="rounded-3xl border border-char-700 bg-char-900/80 p-6 shadow-lg"
            >
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ember-500 text-xl font-black text-white"
                aria-hidden
              >
                {s.n}
              </span>
              <h3 className="mt-5 text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-gray-300">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
