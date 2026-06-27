import { useState } from "react";
import { Link } from "react-router-dom";
import { LESSONS, TRACKS, type Lesson } from "../lib/academyContent";
import { useGbaState, isProTier } from "../lib/storage";

export default function Academy() {
  const state = useGbaState();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="rounded-full bg-ember-500/10 px-3 py-1 text-xs font-semibold text-ember-400">PRO BONUS</span>
        <h1 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">GiantBiteAI Academy</h1>
        <p className="mt-2 text-sm text-gray-400">
          Real technique guides — knife skills, flavor building, nutrition basics. No fluff, no 10-hour video series.
        </p>
      </div>

      {!isProTier(state) && (
        <div className="mt-6 rounded-2xl border border-ember-500/30 bg-gradient-to-br from-ember-500/10 to-red-600/5 p-5 text-center">
          <p className="text-sm text-gray-300">Lesson previews are free. Full guides are a Pro perk.</p>
          <Link to="/pricing" className="btn-ember mt-3 inline-block rounded-full px-5 py-2 text-sm font-semibold text-white">
            See Pro pricing →
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {TRACKS.map((track) => (
          <div key={track}>
            <h2 className="text-lg font-bold text-white">{track}</h2>
            <div className="mt-3 space-y-3">
              {LESSONS.filter((l) => l.track === track).map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  unlocked={isProTier(state)}
                  open={openId === lesson.id}
                  onToggle={() => setOpenId(openId === lesson.id ? null : lesson.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonCard({
  lesson,
  unlocked,
  open,
  onToggle,
}: {
  lesson: Lesson;
  unlocked: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-char-800 bg-char-900 p-5">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 text-left">
        <div>
          <h3 className="font-semibold text-white">{lesson.title}</h3>
          <p className="mt-1 text-sm text-gray-400">{lesson.summary}</p>
          <p className="mt-1.5 text-xs text-gray-500">⏱ {lesson.minutes} min read</p>
        </div>
        <span className="shrink-0 text-gray-500">{unlocked ? (open ? "−" : "+") : "🔒"}</span>
      </button>
      {open && (
        <div className="mt-4 space-y-3 border-t border-char-800 pt-4 text-sm leading-relaxed text-gray-300">
          {unlocked ? (
            lesson.body.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p className="text-gray-500">{lesson.body[0]} <Link to="/pricing" className="text-ember-400 hover:underline">Unlock the full lesson with Pro →</Link></p>
          )}
        </div>
      )}
    </div>
  );
}
