import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function Privacy() {
  return (
    <div className="min-h-dvh bg-char-950">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-12 text-gray-300">
        <Link to="/" className="text-sm text-ember-400 hover:underline">
          ← Back home
        </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: June 28, 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white">1. What we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Recipe/Coach input:</strong> text, photos, and pantry items you type or upload, sent to our AI backend solely to generate your response. We don't use this input to train any model.</li>
            <li><strong>Local app data:</strong> your saved recipes, meal plans, pantry list, streaks, and subscription tier — stored in your browser's local storage on your device, not on our servers. Clearing your browser data deletes it.</li>
            <li><strong>Payment data:</strong> if you subscribe, Stripe (our payment processor) collects and stores your card details directly — we never see or store your full card number.</li>
            <li><strong>Server logs:</strong> standard request logs (IP address, timestamp, endpoint) kept briefly for debugging and abuse prevention.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. What we don't do</h2>
          <p className="mt-2">
            We don't run ads or ad-tracking on this site, and we don't currently use any third-party
            analytics. We don't sell your data to anyone.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Third parties we use</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>An AI provider</strong>, to generate recipes, meal plans, and Coach responses from your input.</li>
            <li><strong>Stripe</strong>, to process subscription payments.</li>
            <li><strong>Railway</strong>, our hosting provider, which runs the server that handles your requests.</li>
          </ul>
          <p className="mt-2">Each of these processes only what's needed to perform their function and has their own privacy policy governing their handling of data.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. No account, no central profile</h2>
          <p className="mt-2">
            GiantBiteAI doesn't currently require sign-up. There's no central account database tying your
            activity to an identity — your plan tier and saved content live only in your own browser. This
            also means we can't recover your data for you if you clear your browser or switch devices.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Children's privacy</h2>
          <p className="mt-2">
            GiantBiteAI is not directed at children under 13, and we don't knowingly collect information
            from them.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Your rights</h2>
          <p className="mt-2">
            Since most data lives in your own browser, you control it directly (clear your browser storage
            to delete it). For anything we hold server-side (payment records, logs), email us and we'll
            respond to access/deletion requests.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">7. Changes to this policy</h2>
          <p className="mt-2">We may update this policy from time to time; the "Last updated" date above will reflect the latest revision.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">8. Contact</h2>
          <p className="mt-2">
            Questions about this policy? Email <a href="mailto:hunter82kh@gmail.com" className="text-ember-400 hover:underline">hunter82kh@gmail.com</a>.
          </p>
        </section>
      </div>
      </div>
      <SiteFooter />
    </div>
  );
}
