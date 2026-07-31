import siteConfig from "../config/site_config.json";
import footerConfig from "../config/footer.json";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const location = useLocation();
  const [copiedCF, setCopiedCF] = useState(false);
  const isLandingPage = location.pathname.startsWith("/landing");

  const handleCopyCF = () => {
    navigator.clipboard.writeText(footerConfig.fiscal_code);
    setCopiedCF(true);
    setTimeout(() => setCopiedCF(false), 2000);
  };

  const allLinks = [
    ...footerConfig.links,
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Sostienici", url: "/sostienici" }
  ];

  return (
    <footer className={`w-full py-12 px-4 md:px-6 flex flex-col items-center justify-center border-t relative z-[80] ${isLandingPage ? "bg-brand-bg border-brand-secondary" : "bg-transparent border-[#e65100]/20"}`}>
      <div className={`w-full max-w-7xl p-6 md:p-10 flex flex-col gap-10 ${isLandingPage ? "bg-white border-2 border-brand-secondary rounded-3xl shadow-[6px_6px_0_0_#1a1025]" : "clay-panel"}`}>
        
        {/* Main Footer Layout: 3 Balanced Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start w-full">
          
          {/* Column 1: Brand & Legal Info */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center">
              <img 
                src={(siteConfig as any).logo_horizontal || "https://img.icons8.com/ios-filled/50/e65100/home.png"} 
                alt="ABBO APS Logo" 
                width="160" 
                height="40" 
                className="h-9 w-auto object-contain grayscale opacity-85" 
              />
            </div>
            
            <div className="flex flex-col gap-1.5 text-xs font-mono text-[#4a1c0d]/80">
              <span>Sede Legale: <strong>{footerConfig.legal_address}</strong></span>
              <div className="flex items-center gap-2">
                <span>Codice Fiscale: <strong className="font-bold">{footerConfig.fiscal_code}</strong></span>
                <button 
                  onClick={handleCopyCF} 
                  type="button"
                  className="text-[10px] px-2 py-0.5 rounded bg-[#e65100]/10 text-[#e65100] font-sans font-bold uppercase hover:bg-[#e65100]/20 transition-colors cursor-pointer"
                >
                  {copiedCF ? "Copiato!" : "Copia"}
                </button>
              </div>
            </div>

            {/* 5x1000 Card */}
            <div className="mt-1 p-3.5 rounded-2xl bg-[#e65100]/5 border border-[#e65100]/15 flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#e65100]">Destina il tuo 5x1000</span>
              <span className="text-xs text-[#4a1c0d]/75 leading-relaxed">
                Dona il 5 per mille ad ABBO APS per sostenere i laboratori didattici di robotica e informatica.
              </span>
            </div>
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

        {/* Bottom Credits Bar */}
        <div className="w-full pt-6 border-t border-[#4a1c0d]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono tracking-wider text-[#4a1c0d]/70 text-center sm:text-left">
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
