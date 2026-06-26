import { Link } from "react-router-dom";

export default function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 select-none">
      <span className="flame-flicker inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ember-400 to-red-600 text-lg shadow-glow">
        🔥
      </span>
      <span className="text-lg font-extrabold tracking-tight text-white">
        GiantBite<span className="text-ember-gradient">AI</span>
      </span>
    </Link>
  );
}
