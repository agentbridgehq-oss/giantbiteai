import { useState } from "react";
import { Link } from "react-router-dom";
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
    <section className="px-4 py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Ask the AI Chef Guide anything</h2>
        <p className="mt-2 text-sm text-gray-400">No sign-up needed for your first couple of questions.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
          className="mt-6 flex gap-2"
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a cooking question..."
            className="flex-1 rounded-full border border-char-700 bg-char-900 px-5 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-ember-500"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="btn-ember shrink-0 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Thinking…" : "Ask"}
          </button>
        </form>

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

        {answer && (
          <p className="mt-6 text-left text-base leading-relaxed text-gray-200">{answer}</p>
        )}

        {blocked && (
          <p className="mt-6 text-sm text-gray-400">
            You've used your free questions here —{" "}
            <Link to="/cook" className="text-ember-400 hover:underline">
              start cooking free
            </Link>{" "}
            to keep chatting with the full AI Coach.
          </p>
        )}
      </div>
    </section>
  );
}
