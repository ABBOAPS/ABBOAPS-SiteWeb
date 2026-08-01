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
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { Ambassador } from "./pages/Ambassador";
import { Tessera } from "./pages/Tessera";
import { TesseraCondizioni } from "./pages/TesseraCondizioni";
import { TesseraPrivacy } from "./pages/TesseraPrivacy";
import { TesseraPartner } from "./pages/TesseraPartner";
import ConsapevolezzaDocenti from "./pages/landing/ConsapevolezzaDocenti";
import ConsapevolezzaIstituti from "./pages/landing/ConsapevolezzaIstituti";
import ConsapevolezzaRagazzi from "./pages/landing/ConsapevolezzaRagazzi";
import LegoDocenti from "./pages/landing/LegoDocenti";
import LegoIstituti from "./pages/landing/LegoIstituti";
import LegoRagazzi from "./pages/landing/LegoRagazzi";
import MinecraftDocenti from "./pages/landing/MinecraftDocenti";
import MinecraftIstituti from "./pages/landing/MinecraftIstituti";
import MinecraftRagazzi from "./pages/landing/MinecraftRagazzi";
import siteConfig from "./config/site_config.json";
import { TwitchLiveWidget } from "./components/TwitchLiveWidget";

import { Footer } from "./components/Footer";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isTesseraPage = location.pathname.startsWith("/tessera");

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col overflow-x-hidden selection:bg-[#e65100] selection:text-white"
      style={{ backgroundColor: siteConfig.theme.background.base, backgroundImage: siteConfig.theme.background.gradient, color: siteConfig.theme.text.primary }}
    >
      {/* Primary Top Navigation */}
      {!isTesseraPage && <Topbar />}

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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/ambassador" element={<Ambassador />} />
          <Route path="/tessera" element={<Tessera />} />
          <Route path="/tessera/condizioni" element={<TesseraCondizioni />} />
          <Route path="/tessera/privacy" element={<TesseraPrivacy />} />
          <Route path="/tessera/partner" element={<TesseraPartner />} />
          
          {/* Landing Pages */}
          <Route path="/landing/consapevolezza-docenti" element={<ConsapevolezzaDocenti />} />
          <Route path="/landing/consapevolezza-istituti" element={<ConsapevolezzaIstituti />} />
          <Route path="/landing/consapevolezza-ragazzi" element={<ConsapevolezzaRagazzi />} />
          <Route path="/landing/lego-docenti" element={<LegoDocenti />} />
          <Route path="/landing/lego-istituti" element={<LegoIstituti />} />
          <Route path="/landing/lego-ragazzi" element={<LegoRagazzi />} />
          <Route path="/landing/minecraft-docenti" element={<MinecraftDocenti />} />
          <Route path="/landing/minecraft-istituti" element={<MinecraftIstituti />} />
          <Route path="/landing/minecraft-ragazzi" element={<MinecraftRagazzi />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isTesseraPage && <Footer />}
      {!isTesseraPage && <TwitchLiveWidget />}
    </div>
  );
}

