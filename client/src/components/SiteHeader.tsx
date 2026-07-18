import { Link } from "react-router-dom";
import Logo from "./Logo";

const NAV = [
  { to: { pathname: "/", hash: "tools" }, label: "Tools" },
  { to: { pathname: "/", hash: "compare" }, label: "Pricing" },
  { to: { pathname: "/", hash: "how" }, label: "How it Works" },
  { to: "/blog", label: "Blog" },
  { to: { pathname: "/", hash: "faq" }, label: "FAQ" },
] as const;

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-char-800/60 bg-char-950/80 backdrop-blur supports-[backdrop-filter]:bg-char-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-400 md:flex">
          {NAV.map((item) => (
            <Link key={item.label} to={item.to} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/cook"
          className="btn-ember shrink-0 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
        >
          Launch App
        </Link>
      </div>
    </header>
  );
}
