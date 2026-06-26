import { useRef, useState } from "react";
import { streamCoach, type ChatMessage } from "../lib/api";
import { touchDailyStreak, getState, canUseCoach, consumeCoachMessage, FREE_COACH_MESSAGES } from "../lib/storage";
import UpgradePrompt from "../components/UpgradePrompt";

const SUGGESTIONS = [
  "Can I substitute butter with oil?",
  "My sauce is too thin, how do I fix it?",
  "What internal temp is safe for chicken?",
  "I have no garlic, what can I use?",
];

export default function Coach() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "I'm your AI Cooking Coach — ask me anything mid-recipe. Substitutions, timing, temps, technique fixes. Go." },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const state = getState();

  async function send(text: string) {
    if (!canUseCoach(getState())) {
      setBlocked(true);
      return;
    }
    const userMsg: ChatMessage = { role: "user", content: text };
    const next = [...messages, userMsg, { role: "assistant" as const, content: "" }];
    setMessages(next);
    setInput("");
    setStreaming(true);

    try {
      let acc = "";
      for await (const delta of streamCoach([...messages, userMsg])) {
        acc += delta;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
      consumeCoachMessage();
      touchDailyStreak();
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: `Error: ${err instanceof Error ? err.message : "something went wrong"}` };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || streaming || blocked) return;
    send(input.trim());
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col" style={{ height: "calc(100vh - 160px)" }}>
      <h1 className="font-display text-2xl font-bold text-white">AI Cooking Coach</h1>
      <p className="mb-1 text-sm text-gray-400">Real-time help while your hands are full.</p>
      {!state.isPro && (
        <p className="mb-4 text-xs text-gray-500">
          {Math.max(0, FREE_COACH_MESSAGES - state.freeCoachMessagesUsed)} free message{FREE_COACH_MESSAGES - state.freeCoachMessagesUsed === 1 ? "" : "s"} left — Pro gets unlimited Coach access.
        </p>
      )}

      {blocked && (
        <div className="mb-4">
          <UpgradePrompt reason="You've used your free Coach messages" />
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-char-800 bg-char-900 p-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user" ? "btn-ember text-white" : "bg-char-800 text-gray-200"
              }`}
            >
              {m.content || (streaming && i === messages.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-char-700 px-3 py-1.5 text-xs text-gray-400 transition hover:border-ember-500 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything mid-cook..."
          className="flex-1 rounded-full border border-char-700 bg-char-900 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-ember-500"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="btn-ember rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
