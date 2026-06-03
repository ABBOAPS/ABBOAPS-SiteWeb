import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Topbar } from "./components/Topbar";
import { Home } from "./pages/Home";
import { ChiSiamo } from "./pages/ChiSiamo";
import { Team } from "./pages/Team";
import { Sostienici } from "./pages/Sostienici";
import { Contatti } from "./pages/Contatti";
import { Documenti } from "./pages/Documenti";
import { DocumentViewer } from "./pages/DocumentViewer";
import { BalanceViewer } from "./pages/BalanceViewer";
import { Notizie } from "./pages/Notizie";
import { NewsDetail } from "./pages/NewsDetail";
import { NotFound } from "./pages/NotFound";
import siteConfig from "./config/site_config.json";

import { Footer } from "./components/Footer";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col overflow-x-hidden selection:bg-[#e65100] selection:text-white"
      style={{ backgroundColor: siteConfig.theme.background.base, backgroundImage: siteConfig.theme.background.gradient, color: siteConfig.theme.text.primary }}
    >
      {/* Primary Top Navigation */}
      <Topbar />

      <main className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/team" element={<Team />} />
          <Route path="/documenti" element={<Documenti />} />
          <Route path="/archivio/bilanci" element={<BalanceViewer />} />
          <Route path="/archivio/bilanci/:year" element={<BalanceViewer />} />
          <Route path="/archivio/:id" element={<DocumentViewer />} />
          <Route path="/sostienici" element={<Sostienici />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="/notizie" element={<Notizie />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

