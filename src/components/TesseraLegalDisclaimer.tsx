import { useState } from "react";
import { Link } from "react-router-dom";
import { Info, ShieldAlert, ChevronDown, ChevronUp, FileText, Lock, Handshake } from "lucide-react";
import tesseraConfig from "../config/tessera.json";

interface TesseraLegalDisclaimerProps {
  isEn?: boolean;
}

export function TesseraLegalDisclaimer({ isEn = false }: TesseraLegalDisclaimerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cfg = tesseraConfig.disclaimer;

  const t = {
    title: isEn ? cfg.titleEn : cfg.title,
    mainNotice: isEn ? cfg.mainNoticeEn : cfg.mainNotice,
    subNotice: isEn ? cfg.subNoticeEn : cfg.subNotice,
    accordionBtn: isEn ? cfg.accordionBtnEn : cfg.accordionBtn,
    accordionContent: isEn ? cfg.accordionContentEn : cfg.accordionContent,
    linkCondizioni: isEn ? cfg.linkCondizioniEn : cfg.linkCondizioni,
    linkPrivacy: isEn ? cfg.linkPrivacyEn : cfg.linkPrivacy,
    linkPartner: isEn ? cfg.linkPartnerEn : cfg.linkPartner,
  };

  return (
    <div 
      className="w-full max-w-lg mt-8 p-5 sm:p-6 rounded-3xl bg-[#fffcf5]/90 border border-[#4a1c0d]/15 shadow-md backdrop-blur-sm flex flex-col gap-4 text-[#4a1c0d] transition-all"
      aria-label={t.title}
    >
      {/* Intestazione Disclaimer */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-[#e65100]/10 border border-[#e65100]/20 flex items-center justify-center text-[#e65100] shrink-0">
          <Info className="w-5 h-5 stroke-[2.5]" />
        </div>
        <h4 className="text-base sm:text-lg font-extrabold text-[#4a1c0d] tracking-tight">
          {t.title}
        </h4>
      </div>

      {/* Testo Principale Sempre Visibile */}
      <p className="text-xs sm:text-sm text-[#4a1c0d]/85 font-medium leading-relaxed">
        {t.mainNotice}
      </p>

      {/* Avviso Secondario Revoca Token */}
      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-950 text-xs font-semibold leading-snug">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>{t.subNotice}</span>
      </div>

      {/* Accordion "Come funziona la verifica" */}
      <div className="w-full pt-1 border-t border-[#4a1c0d]/10">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="w-full min-h-[44px] flex items-center justify-between py-2 text-xs sm:text-sm font-bold text-[#e65100] hover:text-[#8a3a19] focus:outline-none focus:ring-2 focus:ring-[#e65100] focus:ring-offset-2 rounded-xl transition-colors"
        >
          <span>{t.accordionBtn}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#e65100]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#e65100]" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-2 p-3.5 rounded-2xl bg-[#4a1c0d]/5 border border-[#4a1c0d]/10 text-xs text-[#4a1c0d]/90 space-y-2 font-medium leading-relaxed">
            {t.accordionContent.map((item, idx) => (
              <p key={idx}>{item}</p>
            ))}
          </div>
        )}
      </div>

      {/* Tre Collegamenti Legali Obbligatori */}
      <div className="w-full pt-3 border-t border-[#4a1c0d]/10 flex flex-col gap-2 sm:gap-2.5">
        <Link
          to="/tessera/condizioni"
          className="min-h-[44px] px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-[#4a1c0d]/15 text-xs sm:text-sm font-bold text-[#4a1c0d] hover:text-[#e65100] flex items-center gap-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e65100] focus:ring-offset-1"
        >
          <FileText className="w-4 h-4 text-[#e65100] shrink-0" />
          <span>{t.linkCondizioni}</span>
        </Link>

        <Link
          to="/tessera/privacy"
          className="min-h-[44px] px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-[#4a1c0d]/15 text-xs sm:text-sm font-bold text-[#4a1c0d] hover:text-[#e65100] flex items-center gap-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e65100] focus:ring-offset-1"
        >
          <Lock className="w-4 h-4 text-[#e65100] shrink-0" />
          <span>{t.linkPrivacy}</span>
        </Link>

        <Link
          to="/tessera/partner"
          className="min-h-[44px] px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-[#4a1c0d]/15 text-xs sm:text-sm font-bold text-[#4a1c0d] hover:text-[#e65100] flex items-center gap-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e65100] focus:ring-offset-1"
        >
          <Handshake className="w-4 h-4 text-[#e65100] shrink-0" />
          <span>{t.linkPartner}</span>
        </Link>
      </div>
    </div>
  );
}
