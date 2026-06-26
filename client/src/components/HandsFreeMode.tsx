import { useEffect, useRef, useState } from "react";
import { showToast } from "../lib/toast";

interface Props {
  title: string;
  steps: string[];
  onClose: () => void;
}

export default function HandsFreeMode({ title, steps, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.98;
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    speak(`Step ${index + 1}. ${steps[index]}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  function go(delta: number) {
    setIndex((i) => Math.min(Math.max(i + delta, 0), steps.length - 1));
  }

  function toggleListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice commands aren't supported in this browser — try Chrome.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const said = e.results[e.results.length - 1][0].transcript.toLowerCase();
      if (said.includes("next")) go(1);
      else if (said.includes("back") || said.includes("previous")) go(-1);
      else if (said.includes("repeat")) speak(`Step ${index + 1}. ${steps[index]}`);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-char-700 bg-char-900 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-ember-400">{title}</p>
        <p className="mt-2 text-sm text-gray-500">Step {index + 1} of {steps.length}</p>
        <p className="mt-6 min-h-[120px] font-display text-2xl font-semibold text-white">{steps[index]}</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={() => go(-1)} disabled={index === 0} className="rounded-full border border-char-700 px-4 py-2 text-sm text-gray-300 disabled:opacity-30">
            ← Back
          </button>
          <button onClick={() => speak(steps[index])} className="rounded-full border border-char-700 px-4 py-2 text-sm text-gray-300">
            🔊 Repeat
          </button>
          <button onClick={() => go(1)} disabled={index === steps.length - 1} className="btn-ember rounded-full px-5 py-2 text-sm font-semibold text-white disabled:opacity-30">
            Next →
          </button>
        </div>

        <button
          onClick={toggleListening}
          className={`mt-5 rounded-full border px-4 py-2 text-xs font-semibold ${listening ? "border-ember-500 text-ember-400" : "border-char-700 text-gray-400"}`}
        >
          {listening ? "🎤 Listening — say 'next', 'back', or 'repeat'" : "🎤 Enable voice commands"}
        </button>

        <button onClick={onClose} className="mt-6 block w-full text-sm text-gray-500 hover:text-gray-300">
          Exit hands-free mode
        </button>
      </div>
    </div>
  );
}
