import siteConfig from "../config/site_config.json";
import footerConfig from "../config/footer.json";
import { Link, useLocation } from "react-router-dom";
import { NewsletterForm } from "./NewsletterForm";
import { SocialLinks } from "./SocialLinks";
import { organization } from "../config/organization";
import { CopyableValue } from "./CopyableValue";

export function Footer() {
  const location = useLocation();
  const isLandingPage = location.pathname.startsWith("/landing");
  const logoHorizontal = (siteConfig as { logo_horizontal?: string }).logo_horizontal;

  const allLinks = [
    ...footerConfig.links,
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Termini e condizioni", url: "/termini-e-condizioni" },
    { label: "Cookie Policy", url: "/cookie-policy" },
    { label: "Trasparenza IA", url: "/trasparenza-ia" },
    { label: "Sostienici", url: "/sostienici" }
  ];

  return (
    <footer className={`w-full py-8 px-4 md:px-6 flex flex-col items-center justify-center border-t relative z-[80] ${isLandingPage ? "bg-brand-bg border-brand-secondary" : "bg-transparent border-[#e65100]/20"}`}>
      <div className={`w-full max-w-7xl p-5 md:p-6 flex flex-col gap-6 ${isLandingPage ? "bg-white border-2 border-brand-secondary rounded-3xl shadow-[6px_6px_0_0_#1a1025]" : "clay-panel"}`}>
        
        {/* Main Footer Layout: 3 Balanced Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start w-full">
          
          {/* Column 1: Brand */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="flex items-center">
              {logoHorizontal && <img src={logoHorizontal} alt="ABBO APS" width="160" height="40" className="h-9 w-auto object-contain grayscale opacity-85" />}
            </div>
            
            <dl className="grid text-xs font-mono text-[#4a1c0d]/80">
              <div className="grid min-h-11 grid-cols-[6.75rem_minmax(0,1fr)] items-center gap-x-2">
                <dt className="uppercase tracking-wide text-[#4a1c0d]/60">Sede legale</dt>
                <dd>{footerConfig.legal_address}</dd>
              </div>
              <div className="grid min-h-11 grid-cols-[6.75rem_minmax(0,1fr)] items-center gap-x-2">
                <dt className="uppercase tracking-wide text-[#4a1c0d]/60">Codice fiscale</dt>
                <dd className="min-w-0"><CopyableValue value={organization.taxCode} copyLabel="Copia codice fiscale" valueClassName="font-bold" /></dd>
              </div>
              <div className="grid min-h-11 grid-cols-[6.75rem_minmax(0,1fr)] items-center gap-x-2">
                <dt className="uppercase tracking-wide text-[#4a1c0d]/60">IBAN</dt>
                <dd className="min-w-0"><CopyableValue value={organization.iban} copyLabel="Copia IBAN" className="min-w-0" valueClassName="break-all" /></dd>
              </div>
            </dl>
          </div>

          {/* Column 2: Navigation Links Grid */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e65100]">Navigazione</span>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono uppercase tracking-wider text-[#4a1c0d]/80">
              {allLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.url} 
                    className="hover:text-[#e65100] transition-colors inline-block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Newsletter Form */}
          <div className="md:col-span-4 flex flex-col">
            <NewsletterForm variant="compact" className="w-full" />
          </div>

        </div>

        <div className="flex flex-col items-center gap-2 border-t border-[#4a1c0d]/10 pt-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#e65100]">Seguici</span>
          <SocialLinks variant="footer" />
        </div>

        {/* Bottom Credits Bar */}
        <div className="w-full pt-4 border-t border-[#4a1c0d]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono tracking-wider text-[#4a1c0d]/70 text-center sm:text-left">
          <span>{footerConfig.copyright}</span>
          <span>
            {footerConfig.made_with}{" "}
            <a 
              href={footerConfig.developer_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#e65100] transition-colors underline decoration-[#e65100]/30 hover:decoration-[#e65100]"
            >
              {footerConfig.developer_name}
            </a>
          </span>
        </div>

      </div>
    </footer>
  );
}
