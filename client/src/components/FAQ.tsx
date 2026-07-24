const QA = [
  {
    q: "Is it free?",
    a: "Yes. You can start free: recipes every day, a weekly meal plan, and a couple of Coach messages to try the coach. No ads. Paid plans remove limits when you want more — not a bait-and-switch free trial that vanishes in an hour.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. Open the app and cook. Your streak, pantry list, and preferences stay in this browser. (If you clear browser data, those local notes reset — we keep it simple on purpose.)",
  },
  {
    q: "Is this good for people 55 and up?",
    a: "Yes — that is a first-class design goal. Use Comfort Mode (Larger text, High contrast, Less motion) at the top of the home page. Buttons are large, steps are plain English, and Hands-Free Mode can read steps out loud so you don’t have to lean over a tiny screen.",
  },
  {
    q: "I’m not “techy.” Can I still use this?",
    a: "If you can type a few words or take a photo, you can use GiantBiteAI. Start on Cook, add 2–3 ingredients you already have, and press generate. You can ignore everything else until you need it.",
  },
  {
    q: "How accurate is the fridge photo scanner?",
    a: "It is helpful for common items, but vision can misread labels. Always check the ingredient list before you cook — especially for allergies. You can edit the list by hand anytime.",
  },
  {
    q: "Does it replace a doctor or food-safety rules?",
    a: "No. Recipes and coach tips are cooking help, not medical advice. Use a food thermometer for meats, follow package directions for risk items, and when in doubt, throw it out.",
  },
  {
    q: "Will this work on my phone?",
    a: "Yes. It works in a normal phone or computer browser. Add it to your home screen from the browser menu if you want an app-like icon — no store download required.",
  },
  {
    q: "What’s the catch?",
    a: "No ads on the free tier. Limits exist so the free plan stays sustainable. Upgrade only if unlimited recipes, full Coach, and extras are worth it to you.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="px-4 py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-heading" className="gba-section-title text-center font-display text-3xl sm:text-4xl">
          Common questions
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-lg text-gray-300">
          Straight answers for everyday cooks — no jargon wall.
        </p>
        <div className="mt-10 divide-y divide-char-700 rounded-3xl border border-char-700 bg-char-900">
          {QA.map((item) => (
            <details key={item.q} className="group p-5 sm:p-6">
              <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-white">
                {item.q}
                <span className="text-2xl text-gray-400 transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-4 text-base leading-relaxed text-gray-300 sm:text-lg">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
