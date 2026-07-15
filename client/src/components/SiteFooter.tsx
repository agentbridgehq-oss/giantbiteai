import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-char-800 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Logo />
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <Link to="/terms" className="hover:text-gray-300 hover:underline">Terms</Link>
          <Link to="/privacy" className="hover:text-gray-300 hover:underline">Privacy</Link>
        </div>
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} GiantBiteAI. Free to start, no ads.</p>
      </div>
    </footer>
  );
}
