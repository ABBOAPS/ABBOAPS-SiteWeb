import { MailCheck, Send } from "lucide-react";
import { Link } from "react-router-dom";

interface NewsletterFormProps {
  variant?: "full" | "compact";
  className?: string;
}

export function NewsletterForm({ variant = "full", className = "" }: NewsletterFormProps) {
  if (variant === "compact") {
    return (
      <form method="post" action="https://newsletter.abboaps.org/subscription/form" className={`w-full flex flex-col gap-3 ${className}`}>
        <input type="hidden" name="nonce" />
        <input type="hidden" name="l" value="2996078a-4740-488a-96d3-c9bf0c436bbc" />
        
        <div className="flex flex-col gap-2 text-left">
          <span className="text-sm font-bold uppercase tracking-widest text-[#e65100]">Newsletter</span>
          <span className="text-xs opacity-70 mb-1 leading-relaxed">Ricevi gli aggiornamenti su attività e progetti dell'associazione ABBO APS</span>
          <div className="flex flex-col sm:flex-row gap-2 w-full mt-1">
            <input
              type="email"
              name="email"
              required
              placeholder="La tua email"
              className="w-full clay-input text-[#4a1c0d] px-4 py-2.5 font-medium placeholder:text-[#4a1c0d]/40 transition-all text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="clay-btn font-bold px-4 py-2.5 tracking-widest uppercase flex items-center justify-center gap-2 group cursor-pointer text-xs whitespace-nowrap shrink-0"
            >
              <Send className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              Iscriviti
            </button>
          </div>
          <div className="flex items-start gap-2 mt-1">
        <input type="checkbox" id="privacy-compact" name="consent" value="newsletter" required className="mt-0.5 w-3 h-3 cursor-pointer accent-[#e65100]" />
            <label htmlFor="privacy-compact" className="text-[10px] opacity-80 leading-tight cursor-pointer">
              Acconsento a ricevere la newsletter e ho letto la <Link to="/privacy-policy" className="underline font-bold">Privacy Policy</Link>.
            </label>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className={`w-full clay-panel p-8 md:p-12 flex flex-col items-center text-center ${className}`}>
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-4 text-[#4a1c0d]">Newsletter ABBO APS</h2>
      <p className="text-[#8a3a19]/80 mb-8 max-w-xl font-medium leading-relaxed">
        Ricevi gli aggiornamenti sulle attività, i progetti e gli eventi dell'associazione ABBO APS.
      </p>
      
      <form method="post" action="https://newsletter.abboaps.org/subscription/form" className="w-full max-w-md flex flex-col space-y-4">
        <input type="hidden" name="nonce" />
        <input type="hidden" name="l" value="2996078a-4740-488a-96d3-c9bf0c436bbc" />
        
        <input
          type="email"
          name="email"
          required
          placeholder="La tua email *"
          className="w-full clay-input text-[#4a1c0d] px-6 py-4 font-medium placeholder:text-[#4a1c0d]/40 transition-all focus:outline-none"
        />
        <input
          type="text"
          name="name"
          placeholder="Il tuo nome (facoltativo)"
          className="w-full clay-input text-[#4a1c0d] px-6 py-4 font-medium placeholder:text-[#4a1c0d]/40 transition-all focus:outline-none"
        />
        
        <div className="flex items-start gap-3 pt-2 text-left">
          <input type="checkbox" id="privacy-full" name="consent" value="newsletter" required className="mt-1 w-4 h-4 cursor-pointer accent-[#e65100] shrink-0" />
          <label htmlFor="privacy-full" className="text-sm text-[#8a3a19] font-medium leading-tight cursor-pointer">
            Acconsento a ricevere la newsletter e ho letto la <Link to="/privacy-policy" className="underline font-bold">Privacy Policy</Link>.
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full clay-btn font-bold px-8 py-5 mt-2 tracking-widest uppercase flex items-center justify-center gap-3 group cursor-pointer text-sm"
        >
          <MailCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Iscriviti Ora
        </button>
      </form>
    </div>
  );
}
