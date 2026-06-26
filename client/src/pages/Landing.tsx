import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import Hero from "../components/Hero";
import ToolsGrid from "../components/ToolsGrid";
import CompareTable from "../components/CompareTable";
import HowItWorks from "../components/HowItWorks";
import ViralCallout from "../components/ViralCallout";
import FAQ from "../components/FAQ";
import SiteFooter from "../components/SiteFooter";
import { registerReferral } from "../lib/storage";

export default function Landing() {
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
    <div className="bg-char-950">
      {referredBanner && (
        <div className="bg-ember-600/90 px-4 py-2 text-center text-sm font-semibold text-white">
          👋 You were invited by a friend — welcome to GiantBiteAI!
        </div>
      )}
      <SiteHeader />
      <Hero />
      <ToolsGrid />
      <CompareTable />
      <HowItWorks />
      <ViralCallout />
      <FAQ />
      <SiteFooter />
    </div>
  );
}
