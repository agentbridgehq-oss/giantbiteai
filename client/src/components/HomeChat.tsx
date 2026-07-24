import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { streamCoach } from "../lib/api";
import { canUseCoach, consumeCoachMessage, getState } from "../lib/storage";

const SUGGESTIONS = [
  "What can I cook with eggs and rice?",
  "Safe temperature for chicken?",
  "Quick substitute for buttermilk?",
  "Easy dinner for two seniors?",
];

export default function HomeChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);

  async function ask(q: string) {
    const text = q.trim();
    if (!text || loading) return;
    if (!canUseCoach(getState())) {
      setBlocked(true);
      return;
    }
    setLoading(true);
    setAnswer("");
    setBlocked(false);
    try {
      for await (const delta of streamCoach([{ role: "user", content: text }])) {
        setAnswer((a) => a + delta);
      }
      consumeCoachMessage();
    } catch {
      setAnswer("Could not reach the coach just now — try again in a moment, or open Cook to make a full recipe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <p className="mb-2 text-left text-sm font-bold text-gray-300">Try a free coach question</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="flex items-stretch gap-2 rounded-2xl border-2 border-char-600 bg-char-900 px-3 py-2 transition focus-within:border-ember-500"
      >
        <label htmlFor="home-coach" className="sr-only">
          Ask the cooking coach
        </label>
        <input
          id="home-coach"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about cooking…"
          className="min-h-[48px] flex-1 bg-transparent px-2 py-2 text-base text-white placeholder-gray-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          aria-label="Ask coach"
          className="btn-ember flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-xl text-white transition hover:brightness-110 disabled:opacity-30"
        >
          {loading ? (
            <span className="h-3 w-3 animate-pulse rounded-full bg-white" />
          ) : (
            <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
          )}
        </button>
      </form>

      {!answer && !blocked && (
        <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQuestion(s);
                ask(s);
              }}
              className="min-h-[44px] rounded-full border border-char-700 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-ember-500 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {(answer || blocked) && (
        <div className="mt-4 rounded-2xl border border-char-700 bg-char-950 p-4 text-left">
          {blocked ? (
            <p className="text-base text-gray-200">
              Free coach messages used up.{" "}
              <Link to="/pricing" className="font-bold text-ember-400 hover:underline">
                See plans
              </Link>{" "}
              or{" "}
              <Link to="/cook" className="font-bold text-ember-400 hover:underline">
                make a full recipe free
              </Link>
              .
            </p>
          ) : (
            <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-200">{answer}</p>
          )}
        </div>
      )}
    </div>
  );
}
