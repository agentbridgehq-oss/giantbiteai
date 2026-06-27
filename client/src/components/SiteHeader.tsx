import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function SiteHeader() {
  return (
    <header className="border-b border-char-800/60 bg-char-950/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
          <a href="#tools" className="hover:text-slate-900">Tools</a>
          <a href="#compare" className="hover:text-slate-900">Pricing</a>
          <a href="#how" className="hover:text-slate-900">How it Works</a>
          <a href="#faq" className="hover:text-slate-900">FAQ</a>
        </nav>
        <Link
          to="/cook"
          className="btn-ember rounded-full px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
        >
          Launch App
        </Link>
      </div>
    </header>
  );
}
