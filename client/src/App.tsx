import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
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
import NotFound from "./pages/NotFound";
import ToastHost from "./components/ToastHost";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
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
