import { useEffect, useState } from "react";

interface ToastItem {
  id: number;
  message: string;
}

let nextId = 1;

export default function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const message = (e as CustomEvent<string>).detail;
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };
    window.addEventListener("gba:toast", handler);
    return () => window.removeEventListener("gba:toast", handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-full border border-char-700 bg-char-900 px-5 py-2.5 text-sm font-medium text-slate-900 shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
