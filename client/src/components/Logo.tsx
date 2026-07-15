import { Link } from "react-router-dom";

export default function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center select-none">
      <span className="text-lg font-extrabold tracking-tight text-white">
        GiantBite<span className="text-ember-gradient">AI</span>
      </span>
    </Link>
  );
}
