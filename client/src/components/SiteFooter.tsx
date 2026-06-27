import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-char-800 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Logo />
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} GiantBiteAI. Free to start, no ads.</p>
      </div>
    </footer>
  );
}
