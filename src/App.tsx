import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Topbar } from "./components/Topbar";
import siteConfig from "./config/site_config.json";
import { Footer } from "./components/Footer";

const Home = lazy(() => import("./pages/Home").then(({ Home }) => ({ default: Home })));
const ChiSiamo = lazy(() => import("./pages/ChiSiamo").then(({ ChiSiamo }) => ({ default: ChiSiamo })));
const Team = lazy(() => import("./pages/Team").then(({ Team }) => ({ default: Team })));
const Sostienici = lazy(() => import("./pages/Sostienici").then(({ Sostienici }) => ({ default: Sostienici })));
const Contatti = lazy(() => import("./pages/Contatti").then(({ Contatti }) => ({ default: Contatti })));
const Documenti = lazy(() => import("./pages/Documenti").then(({ Documenti }) => ({ default: Documenti })));
const DocumentViewer = lazy(() => import("./pages/DocumentViewer").then(({ DocumentViewer }) => ({ default: DocumentViewer })));
const BalanceViewer = lazy(() => import("./pages/BalanceViewer").then(({ BalanceViewer }) => ({ default: BalanceViewer })));
const Notizie = lazy(() => import("./pages/Notizie").then(({ Notizie }) => ({ default: Notizie })));
const NewsDetail = lazy(() => import("./pages/NewsDetail").then(({ NewsDetail }) => ({ default: NewsDetail })));
const NotFound = lazy(() => import("./pages/NotFound").then(({ NotFound }) => ({ default: NotFound })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then(({ PrivacyPolicy }) => ({ default: PrivacyPolicy })));
const Ambassador = lazy(() => import("./pages/Ambassador").then(({ Ambassador }) => ({ default: Ambassador })));
const Tessera = lazy(() => import("./pages/Tessera").then(({ Tessera }) => ({ default: Tessera })));
const TesseraCondizioni = lazy(() => import("./pages/TesseraCondizioni").then(({ TesseraCondizioni }) => ({ default: TesseraCondizioni })));
const TesseraPrivacy = lazy(() => import("./pages/TesseraPrivacy").then(({ TesseraPrivacy }) => ({ default: TesseraPrivacy })));
const TesseraPartner = lazy(() => import("./pages/TesseraPartner").then(({ TesseraPartner }) => ({ default: TesseraPartner })));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions").then(({ TermsAndConditions }) => ({ default: TermsAndConditions })));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy").then(({ CookiePolicy }) => ({ default: CookiePolicy })));
const AiTransparency = lazy(() => import("./pages/AiTransparency").then(({ AiTransparency }) => ({ default: AiTransparency })));
const LimitedVerification = lazy(() => import("./pages/LimitedVerification").then(({ LimitedVerification }) => ({ default: LimitedVerification })));
const LimitedVerificationRoute = lazy(() => import("./pages/LimitedVerification").then(({ LimitedVerificationRoute }) => ({ default: LimitedVerificationRoute })));
const ConsapevolezzaDocenti = lazy(() => import("./pages/landing/ConsapevolezzaDocenti"));
const ConsapevolezzaIstituti = lazy(() => import("./pages/landing/ConsapevolezzaIstituti"));
const ConsapevolezzaRagazzi = lazy(() => import("./pages/landing/ConsapevolezzaRagazzi"));
const LegoDocenti = lazy(() => import("./pages/landing/LegoDocenti"));
const LegoIstituti = lazy(() => import("./pages/landing/LegoIstituti"));
const LegoRagazzi = lazy(() => import("./pages/landing/LegoRagazzi"));
const MinecraftDocenti = lazy(() => import("./pages/landing/MinecraftDocenti"));
const MinecraftIstituti = lazy(() => import("./pages/landing/MinecraftIstituti"));
const MinecraftRagazzi = lazy(() => import("./pages/landing/MinecraftRagazzi"));
const Docs = lazy(() => import("./docs/Docs").then((module) => ({ default: module.Docs })));

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isTesseraPage = location.pathname.startsWith("/tessera");
  const isLimitedVerificationPage = location.pathname === "/limited" || location.pathname.startsWith("/limited/");

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col overflow-x-hidden selection:bg-[#e65100] selection:text-white"
      style={{ backgroundColor: siteConfig.theme.background.base, backgroundImage: siteConfig.theme.background.gradient, color: siteConfig.theme.text.primary }}
    >
      {/* Primary Top Navigation */}
      {!isTesseraPage && !isLimitedVerificationPage && <Topbar />}

      <main className="flex-1 relative z-10">
        <Suspense fallback={<div className="app-loading" role="status">Caricamento pagina…</div>}>
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
          <Route path="/termini-e-condizioni" element={<TermsAndConditions />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/trasparenza-ia" element={<AiTransparency />} />
          <Route path="/ambassador" element={<Ambassador />} />
          <Route path="/tessera" element={<Tessera />} />
          <Route path="/tessera/condizioni" element={<TesseraCondizioni />} />
          <Route path="/tessera/privacy" element={<TesseraPrivacy />} />
          <Route path="/tessera/partner" element={<TesseraPartner />} />
          <Route path="/limited" element={<LimitedVerification />} />
          <Route path="/limited/:token" element={<LimitedVerificationRoute />} />
          <Route path="/docs/*" element={<Docs />} />
          
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
        </Suspense>
      </main>

      {!isTesseraPage && !isLimitedVerificationPage && <Footer />}
    </div>
  );
}
