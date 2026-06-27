const QA = [
  { q: "Is it free?", a: "Yes — the free tier gives you 3 recipes a day, 1 meal plan a week, and a couple of free AI Coach messages to try it. No ads, ever. Pro removes the limits and unlocks the full AI Coach for $4.99/mo." },
  { q: "What's the catch?", a: "No catch. The free tier is genuinely usable on its own — Pro is for people who want it unlimited, not a bait-and-switch." },
  { q: "Do I need to make an account?", a: "No. Your streak, badges, and saved stats live in your browser. Open the app and start cooking immediately." },
  { q: "How accurate is the photo scanner?", a: "It's good with common fridge/pantry items, but AI vision can still misread items — always double-check the detected ingredient list before cooking, especially for allergens." },
];

export default function FAQ() {
  return (
    <section id="faq" className="px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-display text-3xl font-bold text-white sm:text-4xl">FAQ</h2>
        <div className="mt-10 divide-y divide-char-800 rounded-2xl border border-char-800 bg-char-900">
          {QA.map((item) => (
            <details key={item.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-white">
                {item.q}
                <span className="text-gray-500 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
