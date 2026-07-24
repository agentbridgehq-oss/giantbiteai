import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import Hero from "../components/Hero";
import ToolsGrid from "../components/ToolsGrid";
import WeeklyArticle from "../components/WeeklyArticle";
import CompareTable from "../components/CompareTable";
import HowItWorks from "../components/HowItWorks";
import ForEveryone from "../components/ForEveryone";
import ConversionProof from "../components/ConversionProof";
import ViralCallout from "../components/ViralCallout";
import FAQ from "../components/FAQ";
import SiteFooter from "../components/SiteFooter";
import { registerReferral } from "../lib/storage";

export default function Explore() {
  const [params] = useSearchParams();
  const [referredBanner, setReferredBanner] = useState(false);

  useEffect(() => {
    const ref = params.get("ref");
    if (ref) {
      registerReferral(ref);
      setReferredBanner(true);
    }
  }, [params]);

  return (
    <div className="min-h-dvh bg-char-950">
      {referredBanner && (
        <div className="bg-ember-600/90 px-4 py-3 text-center text-base font-semibold text-white">
          Welcome — a friend invited you to GiantBiteAI. You can start cooking free, no account needed.
        </div>
      )}
      <SiteHeader />
      <main id="main">
        <Hero />
        <ToolsGrid />
        <HowItWorks />
        <ConversionProof />
        <ForEveryone />
        <CompareTable />
        <WeeklyArticle />
        <ViralCallout />
        <FAQ />
        <section className="px-4 pb-24 pt-8">
          <div className="mx-auto max-w-3xl rounded-3xl border border-ember-500/40 bg-gradient-to-b from-ember-500/15 to-char-900 px-6 py-12 text-center sm:px-10">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Dinner from what you already have
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-200">
              Free recipes every day. Comfort Mode for larger text. Coach help while you cook. No ads. No account wall.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/cook"
                className="btn-ember inline-flex min-h-[56px] items-center rounded-full px-8 py-4 text-lg font-bold text-white shadow-glow"
              >
                Start cooking free →
              </a>
              <a
                href="#for-you"
                className="inline-flex min-h-[56px] items-center rounded-full border-2 border-char-600 px-8 py-4 text-lg font-bold text-gray-100"
              >
                Why 55+ love it
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
