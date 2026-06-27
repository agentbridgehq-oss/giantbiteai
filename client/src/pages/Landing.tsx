import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import FeatureCarousel from "../components/FeatureCarousel";
import SlideOutPanel from "../components/SlideOutPanel";
import { canUseCoach, getState, registerReferral } from "../lib/storage";

const FOOD_PHOTO = "https://images.unsplash.com/photo-1518737003272-dac7c4760d5e?auto=format&fit=crop&w=1600&q=80";

function DemoImage() {
  return (
    <div
      className="relative mx-auto mt-12 aspect-[16/10] max-w-2xl overflow-hidden rounded-2xl border border-char-800 shadow-2xl"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 220px 180px at 18% 8%, rgba(255,180,100,0.55) 0%, rgba(255,180,100,0) 70%),
          radial-gradient(ellipse 220px 180px at 50% 8%, rgba(255,180,100,0.55) 0%, rgba(255,180,100,0) 70%),
          linear-gradient(rgba(8,8,10,0.5), rgba(8,8,10,0.55)),
          url(${FOOD_PHOTO})
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, cover",
        backgroundPosition: "center 35%",
      }}
    >
      {/* Phone mockup standing beside the dish, matching the reference composition */}
      <div className="absolute bottom-4 right-[8%] w-24 rounded-xl border-2 border-char-950 bg-char-950/95 p-1.5 shadow-xl sm:w-28">
        <div className="rounded-md bg-char-900 p-1.5">
          <p className="text-[6px] font-semibold uppercase tracking-wide text-ember-400">GiantBiteAI</p>
          <div className="mt-1 h-1.5 w-3/4 rounded bg-char-800" />
          <div className="mt-1 space-y-0.5">
            <div className="h-1 w-full rounded bg-char-800" />
            <div className="h-1 w-5/6 rounded bg-char-800" />
            <div className="h-1 w-2/3 rounded bg-ember-500/60" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-medium text-gray-200 backdrop-blur-sm">
        🍳 Recipe Generator in action
      </div>
    </div>
  );
}

export default function Landing() {
  const [params] = useSearchParams();
  const [referredBanner, setReferredBanner] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<"chat" | "saved" | "calendar" | "timer">("chat");
  const [pendingQuestion, setPendingQuestion] = useState("");
  const [bottomInput, setBottomInput] = useState("");
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const ref = params.get("ref");
    if (ref) {
      registerReferral(ref);
      setReferredBanner(true);
    }
  }, [params]);

  function askFromBottomBar(e: React.FormEvent) {
    e.preventDefault();
    const text = bottomInput.trim();
    if (!text) return;
    if (!canUseCoach(getState())) {
      setBlocked(true);
      return;
    }
    setBlocked(false);
    setPendingQuestion(text);
    setBottomInput("");
    setPanelTab("chat");
    setPanelOpen(true);
  }

  return (
    <div className="min-h-screen bg-char-950 pb-24">
      {referredBanner && (
        <div className="bg-ember-600/90 px-4 py-2 text-center text-sm font-semibold text-white">
          👋 You were invited by a friend — welcome to GiantBiteAI!
        </div>
      )}

      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-4 text-sm font-semibold text-gray-300">
          <Link to="/explore" className="transition hover:text-white">Explore</Link>
          <Link to="/pricing" className="transition hover:text-white">Pricing</Link>
          <button
            type="button"
            onClick={() => {
              setPanelTab("saved");
              setPanelOpen(true);
            }}
            className="rounded-full border border-char-700 px-3 py-1.5 text-xs transition hover:border-ember-500 hover:text-white"
          >
            🗓️ My Week
          </button>
        </nav>
      </header>

      <section
        className="relative overflow-hidden px-4 pb-20 pt-10 text-center"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 380px 280px at 30% 0%, rgba(255,170,90,0.32) 0%, rgba(255,170,90,0) 70%),
            radial-gradient(ellipse 380px 280px at 70% 0%, rgba(255,170,90,0.32) 0%, rgba(255,170,90,0) 70%),
            linear-gradient(rgba(10,10,13,0.8), rgba(10,10,13,0.94)),
            url(${FOOD_PHOTO})
          `,
          backgroundSize: "100% 100%, 100% 100%, 100% 100%, cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            The Future of
            <br />
            <span className="text-ember-gradient">Cooking is AI.</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-base text-gray-300 sm:text-lg">
            Three AI tools, free to start: a recipe generator, a meal planner, and a cooking coach that's actually
            there while you cook — no ads, no subscription required to try it.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/cook" className="btn-ember flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-glow transition hover:brightness-110">
              🍳 Start Cooking <span aria-hidden>→</span>
            </Link>
            <Link to="/explore" className="flex items-center gap-2 rounded-full border border-char-700 bg-char-900/80 px-7 py-3.5 text-base font-semibold text-gray-200 transition hover:border-char-600 hover:text-white">
              ✨ Explore Tools
            </Link>
          </div>

          <DemoImage />
        </div>
      </section>

      <FeatureCarousel />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-char-800 bg-char-950/95 px-4 py-3 backdrop-blur">
        <form onSubmit={askFromBottomBar} className="mx-auto flex max-w-2xl gap-2">
          <input
            value={bottomInput}
            onChange={(e) => setBottomInput(e.target.value)}
            placeholder="Ask the AI Chef Guide anything..."
            className="flex-1 rounded-full border border-char-700 bg-char-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-ember-500"
          />
          <button type="submit" disabled={!bottomInput.trim()} className="btn-ember shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            Ask
          </button>
          <button
            type="button"
            onClick={() => {
              setPanelTab("timer");
              setPanelOpen(true);
            }}
            className="shrink-0 rounded-full border border-char-700 px-3 py-2.5 text-sm text-gray-300 transition hover:border-ember-500 hover:text-white"
            aria-label="Open timer"
          >
            ⏱
          </button>
        </form>
        {blocked && (
          <p className="mx-auto mt-1.5 max-w-2xl text-center text-xs text-gray-500">
            Free questions used up — <Link to="/pricing" className="text-ember-400 hover:underline">upgrade for unlimited</Link>.
          </p>
        )}
      </div>

      <SlideOutPanel
        open={panelOpen}
        tab={panelTab}
        onTabChange={setPanelTab}
        onClose={() => setPanelOpen(false)}
        pendingQuestion={pendingQuestion}
        onPendingConsumed={() => setPendingQuestion("")}
      />
    </div>
  );
}
