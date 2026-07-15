import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AppShell from "./components/AppShell";
import Cook from "./pages/Cook";
import Plan from "./pages/Plan";
import Coach from "./pages/Coach";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Pantry from "./pages/Pantry";
import Tools from "./pages/Tools";
import Pairing from "./pages/Pairing";
import Academy from "./pages/Academy";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import ToastHost from "./components/ToastHost";
import ScrollToTop from "./components/ScrollToTop";

const OpenDashboard = lazy(() => import("./pages/OpenDashboard"));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route
          path="/open-ui"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
              <OpenDashboard />
            </Suspense>
          }
        />
        <Route element={<AppShell />}>
          <Route path="/cook" element={<Cook />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/pantry" element={<Pantry />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/pairing" element={<Pairing />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastHost />
    </>
  );
}
