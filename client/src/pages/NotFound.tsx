import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-char-950">
      <SiteHeader />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <span className="text-4xl" aria-hidden>
          🍳
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold text-white">Nothing cooking here</h1>
        <p className="mt-2 text-gray-400">That page doesn&apos;t exist.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn-ember rounded-full px-6 py-3 text-sm font-semibold text-white">
            Back home
          </Link>
          <Link
            to="/cook"
            className="rounded-full border border-char-700 px-6 py-3 text-sm font-semibold text-gray-200 transition hover:border-char-600 hover:text-white"
          >
            Start cooking
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
