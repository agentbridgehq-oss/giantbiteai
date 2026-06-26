import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="text-4xl">🍳</span>
      <h1 className="mt-4 font-display text-2xl font-bold text-white">Nothing cooking here</h1>
      <p className="mt-2 text-gray-400">That page doesn't exist.</p>
      <Link to="/" className="btn-ember mt-6 rounded-full px-6 py-3 text-sm font-semibold text-white">
        Back home
      </Link>
    </div>
  );
}
