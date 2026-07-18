import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Mic, X } from "lucide-react";
import { streamCoach, type ChatMessage } from "../lib/api";
import { canUseCoach, consumeCoachMessage, getState } from "../lib/storage";

const SUGGESTIONS = [
  "What can I make with what's in my fridge?",
  "Walk me through cooking a perfect steak",
  "Plan me a cheap dinner for 4",
];

export default function SideChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.abort?.();
    };
  }, []);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ""));
    window.speechSynthesis.speak(utter);
  }

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || loading) return;
    if (!canUseCoach(getState())) {
      setBlocked(true);
      return;
    }
    const history: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setLoading(true);
    setBlocked(false);
    let acc = "";
    try {
      setMessages([...history, { role: "assistant", content: "" }]);
      for await (const delta of streamCoach(history)) {
        acc += delta;
        setMessages([...history, { role: "assistant", content: acc }]);
      }
      consumeCoachMessage();
      if (voiceMode) speak(acc);
    } catch {
      setMessages([
        ...history,
        { role: "assistant", content: "Couldn't reach the AI Coach just now — try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition || listening) return;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setListening(false);
      send(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }

  // Escape to close drawer; mark closed drawer inert so tab can't reach it
  useEffect(() => {
    const el = drawerRef.current;
    if (el) {
      if (open) el.removeAttribute("inert");
      else el.setAttribute("inert", "");
    }
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Floating launcher — clear of home indicator on notched phones */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open AI Chef chat"
          className="btn-ember fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white shadow-glow transition hover:scale-105 mb-[env(safe-area-inset-bottom)] mr-[env(safe-area-inset-right)]"
        >
          👨‍🍳
        </button>
      )}

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 md:bg-transparent" onClick={() => setOpen(false)} aria-hidden />
      )}

      {/* Drawer — inert + pointer-events-none when closed so focus can't land offscreen */}
      <aside
        ref={drawerRef}
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-char-800 bg-char-950 shadow-2xl transition-transform duration-300 sm:w-[400px] ${
          open ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-char-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👨‍🍳</span>
            <div>
              <div className="text-sm font-semibold text-white">AI Chef Guide</div>
              <div className="text-[11px] text-gray-500">Recipes, techniques, meal ideas — ask anything</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (voiceMode) window.speechSynthesis?.cancel();
                setVoiceMode(!voiceMode);
              }}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                voiceMode ? "border-ember-500 text-ember-400" : "border-char-700 text-gray-400"
              }`}
            >
              {voiceMode ? "🔊 Voice on" : "🔇 Voice off"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-char-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">Talk to your AI Chef — type or tap the mic.</p>
              <div className="mt-4 flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-xl border border-char-800 px-3 py-2 text-xs text-gray-400 transition hover:border-ember-500 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.role === "user" ? "bg-ember-500 text-white" : "border border-char-800 bg-char-900 text-gray-200"
                }`}
              >
                {m.content || (loading && i === messages.length - 1 ? "…" : "")}
              </div>
            </div>
          ))}
          {blocked && (
            <div className="rounded-xl border border-char-800 bg-char-900 p-3 text-sm text-gray-400">
              You've used your free Coach questions —{" "}
              <Link to="/pricing" className="text-ember-400 hover:underline" onClick={() => setOpen(false)}>
                upgrade
              </Link>{" "}
              for unlimited cooking help.
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-1.5 border-t border-char-800 px-3 py-3"
        >
          <button
            type="button"
            onClick={startListening}
            aria-label="Speak your question"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
              listening ? "animate-pulse border-ember-500 text-ember-400" : "border-char-700 text-gray-400 hover:text-white"
            }`}
          >
            <Mic className="h-4 w-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? "Listening…" : "Ask your AI Chef anything…"}
            className="flex-1 rounded-lg border border-char-700 bg-char-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition focus:border-ember-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ember-500 text-white transition hover:brightness-110 disabled:opacity-30"
          >
            {loading ? <span className="h-3 w-3 animate-pulse rounded-full bg-white" /> : <ArrowUp className="h-4 w-4" strokeWidth={2.5} />}
          </button>
        </form>
      </aside>
    </>
  );
}
