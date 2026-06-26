const ROWS = [
  { name: "GiantBiteAI", price: "Free, or $4.99/mo Pro", limit: "3 recipes/day free", ads: "None, ever", coach: "Yes (2 free, unlimited on Pro)", us: true },
  { name: "SideChef", price: "$4.99/mo ($49.99/yr)", limit: "Limited free tier", ads: "Yes (free tier)", coach: "No" },
  { name: "Whisk", price: "$2.99/mo", limit: "5 recipes/mo free", ads: "Yes (free tier)", coach: "No" },
  { name: "ChefGPT", price: "$2.99/mo", limit: "Limited free tier", ads: "Yes (free tier)", coach: "No" },
];

export default function CompareTable() {
  return (
    <section id="compare" className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">A free tier that's actually usable</h2>
          <p className="mt-3 text-gray-400">
            The #1 complaint across every AI recipe app: stingy free tiers, ads, and silence once you're actually cooking. We built around all three.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-char-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-char-900 text-gray-400">
              <tr>
                <th className="px-5 py-4 font-semibold">App</th>
                <th className="px-5 py-4 font-semibold">Price</th>
                <th className="px-5 py-4 font-semibold">Free tier</th>
                <th className="px-5 py-4 font-semibold">Ads</th>
                <th className="px-5 py-4 font-semibold">Real-time cooking help</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-char-800">
              {ROWS.map((r) => (
                <tr key={r.name} className={r.us ? "bg-ember-500/5" : "bg-char-950"}>
                  <td className="px-5 py-4 font-bold text-white">
                    {r.name} {r.us && <span className="ml-1 text-ember-400">★</span>}
                  </td>
                  <td className="px-5 py-4 text-gray-300">{r.price}</td>
                  <td className="px-5 py-4 text-gray-300">{r.limit}</td>
                  <td className="px-5 py-4 text-gray-300">{r.ads}</td>
                  <td className="px-5 py-4 text-gray-300">{r.coach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Competitor pricing reflects publicly listed plans as of 2026 and may change.
        </p>
      </div>
    </section>
  );
}
