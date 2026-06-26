import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function SiteHeader() {
  return (
    <header className="border-b border-char-800/60 bg-char-950/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-400 md:flex">
          <a href="#tools" className="hover:text-white">Tools</a>
          <a href="#compare" className="hover:text-white">Why Free</a>
          <a href="#how" className="hover:text-white">How it Works</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
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
