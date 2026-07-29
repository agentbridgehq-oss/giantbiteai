import { Link } from "react-router-dom";
import Logo from "./Logo";
import ComfortBar from "./ComfortBar";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-char-800/80 bg-char-950/95 backdrop-blur">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Logo />
        <nav
          className="hidden items-center gap-1 text-base font-semibold text-gray-300 lg:flex"
          aria-label="Primary"
        >
          <a href="#tools" className="rounded-full px-3 py-2 hover:bg-char-800 hover:text-white">
            Tools
          </a>
          <a href="#how" className="rounded-full px-3 py-2 hover:bg-char-800 hover:text-white">
            How it works
          </a>
          <a href="#for-you" className="rounded-full px-3 py-2 hover:bg-char-800 hover:text-white">
            For 55+
          </a>
          <a href="#faq" className="rounded-full px-3 py-2 hover:bg-char-800 hover:text-white">
            FAQ
          </a>
          <Link to="/blog" className="rounded-full px-3 py-2 hover:bg-char-800 hover:text-white">
            Blog
          </Link>
        </nav>
        <div className="flex flex-wrap items-center gap-2">
          <ComfortBar compact />
          <Link
            to="/cook"
            className="btn-launch inline-flex min-h-[44px] items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold tracking-tight text-white transition"
          >
            Launch app
          </Link>
        </div>
      </div>
    </header>
  );
}
