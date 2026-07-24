import { Link } from "react-router-dom";
import { PRO_PRICE_MONTHLY, REGULAR_PRICE_MONTHLY } from "../lib/storage";

/** Competitive positioning vs converting AI recipe apps — prices approximate public listings. */
const ROWS = [
  {
    name: "GiantBiteAI",
    price: `Free · $${REGULAR_PRICE_MONTHLY}/mo · $${PRO_PRICE_MONTHLY}/mo Pro`,
    limit: "3 recipes/day + 1 plan/week free",
    ads: "None, ever",
    coach: "Yes — Coach + hands-free steps",
    comfort: "Comfort Mode (55+)",
    us: true,
  },
  {
    name: "SideChef",
    price: "~$4.99/mo",
    limit: "Limited free tier",
    ads: "Often on free",
    coach: "No live coach",
    comfort: "Standard app UI",
    us: false,
  },
  {
    name: "Whisk",
    price: "~$2.99/mo",
    limit: "Very limited free recipes",
    ads: "Common on free",
    coach: "No mid-cook coach",
    comfort: "Standard app UI",
    us: false,
  },
  {
    name: "Typical AI recipe chat",
    price: "Varies / usage caps",
    limit: "Chat only, no kitchen OS",
    ads: "Varies",
    coach: "Chat only — no pantry/plan loop",
    comfort: "Tiny mobile chat",
    us: false,
  },
];

export default function CompareTable() {
  return (
    <section id="compare" className="px-4 py-20" aria-labelledby="compare-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-ember-400">Honest comparison</p>
          <h2 id="compare-heading" className="gba-section-title mt-3 font-display text-3xl sm:text-4xl">
            A free tier that is actually usable
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            What people complain about online: stingy free tiers, ads, and silence once they start cooking. We built the opposite.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto rounded-3xl border border-char-700">
          <table className="w-full min-w-[720px] text-left text-base">
            <thead className="bg-char-900 text-gray-300">
              <tr>
                <th className="px-5 py-4 font-bold">App</th>
                <th className="px-5 py-4 font-bold">Price</th>
                <th className="px-5 py-4 font-bold">Free tier</th>
                <th className="px-5 py-4 font-bold">Ads</th>
                <th className="px-5 py-4 font-bold">While cooking</th>
                <th className="px-5 py-4 font-bold">Readability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-char-800">
              {ROWS.map((r) => (
                <tr key={r.name} className={r.us ? "bg-ember-500/10" : "bg-char-950"}>
                  <td className="px-5 py-4 font-bold text-white">
                    {r.name} {r.us && <span className="ml-1 text-ember-400">★ you</span>}
                  </td>
                  <td className="px-5 py-4 text-gray-200">{r.price}</td>
                  <td className="px-5 py-4 text-gray-200">{r.limit}</td>
                  <td className="px-5 py-4 text-gray-200">{r.ads}</td>
                  <td className="px-5 py-4 text-gray-200">{r.coach}</td>
                  <td className="px-5 py-4 text-gray-200">{r.comfort}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Competitor pricing reflects publicly listed plans and may change. GiantBiteAI is independent software.
        </p>
        <div className="mt-8 text-center">
          <Link
            to="/cook"
            className="btn-ember inline-flex min-h-[52px] items-center rounded-full px-8 py-4 text-lg font-bold text-white shadow-glow"
          >
            Start free — cook in under a minute →
          </Link>
        </div>
      </div>
    </section>
  );
}
