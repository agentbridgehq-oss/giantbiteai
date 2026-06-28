import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { streamCoach } from "../lib/api";
import { canUseCoach, consumeCoachMessage, getState } from "../lib/storage";

const SUGGESTIONS = ["What can I cook with just eggs and rice?", "How do I keep chicken from drying out?", "Quick substitute for buttermilk?"];

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
      setAnswer("Couldn't reach the AI Coach just now — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="flex items-end gap-1.5 rounded-lg border border-char-700 bg-char-900 px-3 py-2 transition focus-within:border-ember-500"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask the AI Chef Guide anything..."
          className="flex-1 bg-transparent py-1 text-sm text-white placeholder-gray-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          aria-label="Ask"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ember-500 text-white transition hover:brightness-110 disabled:opacity-30"
        >
          {loading ? <span className="h-3 w-3 animate-pulse rounded-full bg-white" /> : <ArrowUp className="h-4 w-4" strokeWidth={2.5} />}
        </button>
      </form>

      {!answer && !blocked && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQuestion(s);
                ask(s);
              }}
              className="rounded-full border border-char-800 px-3 py-1.5 text-xs text-gray-400 transition hover:border-ember-500 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {(answer || blocked) && (
        <div className="mt-3 max-h-40 overflow-y-auto rounded-xl border border-char-800 bg-char-950 p-3 text-left text-sm text-gray-200">
          {answer}
          {blocked && (
            <p className="text-gray-400">
              You've used your free questions here —{" "}
              <Link to="/cook" className="text-ember-400 hover:underline">
                start cooking free
              </Link>{" "}
              to keep chatting with the full AI Coach.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
