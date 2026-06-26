const QA = [
  { q: "Is it actually free forever?", a: "Yes. The core tools — Recipe Generator, Meal Planner, AI Cooking Coach — run on open-source models and have no subscription, no paywall, and no ads. That's the whole point." },
  { q: "What's the catch?", a: "No catch. GiantBiteAI is open source. If we ever add an optional premium tier, the free tools you're using today stay free." },
  { q: "Which AI models power it?", a: "DeepSeek-R1 handles reasoning — turning ingredients into real recipes and plans. Qwen-VL handles vision — identifying ingredients from a photo of your fridge or pantry." },
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
