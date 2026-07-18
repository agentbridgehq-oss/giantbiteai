import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace(/^#/, ""));
      // Wait a frame so the target route has painted (e.g. / → #tools from Blog).
      const jump = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      };
      // Double-rAF: first paint of new route, then measure.
      requestAnimationFrame(() => requestAnimationFrame(jump));
      // Fallback if lazy content mounts a beat later
      const t = window.setTimeout(jump, 120);
      return () => window.clearTimeout(t);
    }

    // "auto" snaps to top and bypasses global smooth scroll on route change
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
