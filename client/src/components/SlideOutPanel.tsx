import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { streamCoach, type ChatMessage } from "../lib/api";
import {
  canUseCoach,
  consumeCoachMessage,
  getState,
  setCalendarMeal,
  clearCalendarMeal,
  useGbaState,
  WEEK_DAYS,
} from "../lib/storage";

type Tab = "chat" | "saved" | "calendar" | "timer";

interface Props {
  open: boolean;
  tab: Tab;
  onTabChange: (t: Tab) => void;
  onClose: () => void;
  pendingQuestion: string;
  onPendingConsumed: () => void;
}

export default function SlideOutPanel({ open, tab, onTabChange, onClose, pendingQuestion, onPendingConsumed }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close panel" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-char-800 bg-char-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-char-800 px-4 py-3">
          <div className="flex gap-1 rounded-full border border-char-800 bg-char-900 p-1">
            {(["chat", "saved", "calendar", "timer"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTabChange(t)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  tab === t ? "btn-ember text-white" : "text-gray-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button type="button" onClick={onClose} className="ml-2 shrink-0 text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {tab === "chat" && <ChatTab pendingQuestion={pendingQuestion} onPendingConsumed={onPendingConsumed} />}
          {tab === "saved" && <SavedTab />}
          {tab === "calendar" && <CalendarTab />}
          {tab === "timer" && <TimerTab />}
        </div>
      </div>
    </div>
  );
}

function ChatTab({ pendingQuestion, onPendingConsumed }: { pendingQuestion: string; onPendingConsumed: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const handledPending = useRef("");

  async function send(text: string) {
    const q = text.trim();
    if (!q || streaming) return;
    if (!canUseCoach(getState())) {
      setBlocked(true);
      return;
    }
    setBlocked(false);
    const next = [...messages, { role: "user" as const, content: q }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    let acc = "";
    setMessages([...next, { role: "assistant", content: "" }]);
    try {
      for await (const delta of streamCoach(next)) {
        acc += delta;
        setMessages([...next, { role: "assistant", content: acc }]);
      }
      consumeCoachMessage();
    } catch {
      setMessages([...next, { role: "assistant", content: "Couldn't reach the AI Coach just now." }]);
    } finally {
      setStreaming(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    if (pendingQuestion && pendingQuestion !== handledPending.current) {
      handledPending.current = pendingQuestion;
      send(pendingQuestion);
      onPendingConsumed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuestion]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3">
        {messages.length === 0 && <p className="text-sm text-gray-500">Your conversation history with the AI Coach shows up here.</p>}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${m.role === "user" ? "btn-ember text-white" : "bg-char-900 text-gray-200"}`}>
              {m.content || "…"}
            </div>
          </div>
        ))}
        {blocked && (
          <p className="text-xs text-gray-500">
            Free Coach messages used up — <Link to="/pricing" className="text-ember-400 hover:underline">upgrade</Link> for unlimited.
          </p>
        )}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up..."
          className="flex-1 rounded-full border border-char-700 bg-char-900 px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-ember-500"
        />
        <button type="submit" disabled={streaming || !input.trim()} className="btn-ember shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  );
}

function SavedTab() {
  const state = useGbaState();
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">Saved Recipes ({state.savedRecipes.length})</h3>
      {state.savedRecipes.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">Save a recipe from Cook to see it here.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {state.savedRecipes.map((r) => (
            <li key={r.title} className="rounded-xl border border-char-800 bg-char-900 p-3">
              <p className="text-sm font-medium text-white">{r.title}</p>
              <p className="mt-1 text-xs text-gray-500">{r.summary}</p>
            </li>
          ))}
        </ul>
      )}
      <Link to="/dashboard" className="mt-4 inline-block text-sm text-ember-400 hover:underline">
        Manage all saved recipes →
      </Link>
    </div>
  );
}

function CalendarTab() {
  const state = useGbaState();

  return (
    <div>
      <h3 className="text-sm font-semibold text-white">This Week's Meal Calendar</h3>
      <p className="mt-1 text-xs text-gray-500">Assign a saved recipe to a day.</p>
      <div className="mt-3 space-y-2">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="flex items-center justify-between gap-2 rounded-xl border border-char-800 bg-char-900 p-2.5">
            <span className="w-20 shrink-0 text-xs font-semibold text-gray-300">{day}</span>
            <select
              value={state.mealCalendar[day] || ""}
              onChange={(e) => (e.target.value ? setCalendarMeal(day, e.target.value) : clearCalendarMeal(day))}
              className="flex-1 rounded-lg border border-char-700 bg-char-950 px-2 py-1.5 text-xs text-white outline-none focus:border-ember-500"
            >
              <option value="">— none —</option>
              {state.savedRecipes.map((r) => (
                <option key={r.title} value={r.title}>{r.title}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {state.savedRecipes.length === 0 && <p className="mt-3 text-xs text-gray-500">Save some recipes first to schedule them here.</p>}
    </div>
  );
}

function TimerTab() {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [minutesInput, setMinutesInput] = useState("10");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (typeof window !== "undefined") {
            try {
              new AudioContext();
            } catch {
              // ignore
            }
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function start() {
    const m = Math.max(0, Number(minutesInput) || 0);
    const secs = m * 60;
    if (secs <= 0) return;
    setTotalSeconds(secs);
    setRemaining(secs);
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setRemaining(0);
    setTotalSeconds(0);
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const done = totalSeconds > 0 && remaining === 0;

  return (
    <div className="text-center">
      <h3 className="text-sm font-semibold text-white">Cooking Timer</h3>
      {totalSeconds === 0 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          <input
            type="number"
            min={1}
            value={minutesInput}
            onChange={(e) => setMinutesInput(e.target.value)}
            className="w-20 rounded-xl border border-char-700 bg-char-900 px-3 py-2 text-center text-sm text-white outline-none focus:border-ember-500"
          />
          <span className="text-sm text-gray-400">minutes</span>
        </div>
      ) : (
        <p className={`mt-4 font-display text-5xl font-bold ${done ? "text-ember-400" : "text-white"}`}>{mm}:{ss}</p>
      )}
      {done && <p className="mt-2 text-sm text-ember-400">⏰ Time's up!</p>}
      <div className="mt-5 flex justify-center gap-2">
        {totalSeconds === 0 ? (
          <button type="button" onClick={start} className="btn-ember rounded-full px-6 py-2.5 text-sm font-semibold text-white">
            Start Timer
          </button>
        ) : (
          <>
            {!done && (
              <button
                type="button"
                onClick={() => setRunning((r) => !r)}
                className="rounded-full border border-char-700 px-5 py-2.5 text-sm font-semibold text-gray-200"
              >
                {running ? "Pause" : "Resume"}
              </button>
            )}
            <button type="button" onClick={reset} className="rounded-full border border-char-700 px-5 py-2.5 text-sm font-semibold text-gray-200">
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
