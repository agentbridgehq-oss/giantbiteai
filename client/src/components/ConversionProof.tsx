/**
 * Conversion strip — honest scenarios, NOT fake user counts or fake reviews.
 * Matches what converting cooking apps do: concrete outcomes + risk reversal.
 */
const CARDS = [
  {
    title: "Leftovers → dinner tonight",
    body: "Half a chicken, rice, sad veggies? Leftovers mode turns “I should throw this out” into a real plate — the #1 reason people open AI cooking apps.",
  },
  {
    title: "Help while your hands are dirty",
    body: "Hands-Free Mode reads the next step out loud. Coach answers mid-recipe. This is where SideChef-style apps go quiet and people bounce to Google.",
  },
  {
    title: "Built for real eyes & real ages",
    body: "Comfort Mode: larger text, high contrast, less motion. TikTok-first kitchen apps forget 55+ and anyone who just wants calm, clear help.",
  },
  {
    title: "Free that is actually free",
    body: "No ads. No account wall. Recipes every day on free. Upgrade only when caps get in the way — the freemium pattern that converts without bait-and-switch.",
  },
];

export default function ConversionProof() {
  return (
    <section className="border-y border-char-800 bg-char-900/60 px-4 py-16" aria-labelledby="why-wins-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-ember-400">Why this converts</p>
          <h2 id="why-wins-heading" className="gba-section-title mt-3 font-display text-3xl sm:text-4xl">
            What winning kitchen apps do — we do it cleaner
          </h2>
          <p className="mt-3 text-lg text-gray-300">
            No fake “10,000 cooks” badges. Real product edges against paywalled recipe apps and silent meal planners.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CARDS.map((c) => (
            <article
              key={c.title}
              className="rounded-3xl border border-char-700 bg-char-950/80 p-6 sm:p-7"
            >
              <h3 className="text-xl font-bold text-white">{c.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-gray-300">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
