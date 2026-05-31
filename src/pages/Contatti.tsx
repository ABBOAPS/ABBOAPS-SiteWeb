import { useState } from "react";
import { Mail, MailCheck, ExternalLink } from "lucide-react";
import contattiConfig from "../config/contatti.json";
import { SEO } from "../components/SEO";

export function Contatti() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct pre-filled email details
    const subject = encodeURIComponent(`Contatto dal Sito Web ABBO - ${name || "Utente"}`);
    const body = encodeURIComponent(
      `Ciao Team di ABBO,\n\n` +
      `Mi chiamo: ${name || "[Nessun nome fornito]"}\n` +
      `La mia email di contatto: ${email || "[Nessuna email fornita]"}\n\n` +
      `Messaggio:\n${message || "[Nessun messaggio fornito]"}\n\n` +
      `---\nInviato tramite il modulo contatti abboaps.it`
    );

    // Dynamic redirection via mailto protocol
    window.location.href = `mailto:${contattiConfig.info.email_value}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative z-20 w-full min-h-screen pt-40 px-6 md:px-24 flex flex-col pb-48 text-[#4a1c0d]">
      <SEO title={contattiConfig.title} url="/contatti" />
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center">
        
        <div className="clay-card p-10 md:p-20 flex flex-col items-center w-full">
            <Mail className="w-12 h-12 mb-8 opacity-40 text-[#4a1c0d]" />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-[#4a1c0d]">{contattiConfig.title}</h1>
            
            <p className="text-xl font-medium tracking-tight text-[#8a3a19]/80 mb-12 text-center max-w-2xl leading-relaxed">
               {contattiConfig.description}
            </p>

            {/* Email compilation form */}
            <form className="w-full max-w-xl flex flex-col space-y-6" onSubmit={handleSubmit}>
               <div className="flex flex-col md:flex-row gap-6">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={contattiConfig.form.name_placeholder}
                    className="w-full clay-input text-[#4a1c0d] px-6 py-4 font-medium placeholder:text-[#4a1c0d]/40 transition-all"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={contattiConfig.form.email_placeholder}
                    className="w-full clay-input text-[#4a1c0d] px-6 py-4 font-medium placeholder:text-[#4a1c0d]/40 transition-all"
                  />
               </div>
               <textarea
                 rows={5}
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 placeholder={contattiConfig.form.message_placeholder}
                 className="w-full clay-input text-[#4a1c0d] px-6 py-4 focus:outline-none font-medium resize-none placeholder:text-[#4a1c0d]/40 transition-all"
               ></textarea>
               
               <div className="flex flex-col space-y-3">
                 <button
                   type="submit"
                   className="w-full clay-btn font-bold px-8 py-5 tracking-widest uppercase flex items-center justify-center gap-2 group cursor-pointer"
                 >
                   <MailCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                   Prepara ed Invia Email
                 </button>
                 <span className="text-xs text-center text-[#8a3a19]/70 font-medium">
                   Cliccando il pulsante, si aprirà il tuo programma di posta elettronica con il testo già compilato.
                 </span>
               </div>
            </form>

            {/* Direct fallback link divider */}
            <div className="flex items-center gap-4 w-full max-w-xl my-8">
              <div className="h-px bg-[#e65100]/10 flex-1"></div>
              <span className="text-xs text-[#8a3a19]/50 font-bold uppercase tracking-widest">Oppure</span>
              <div className="h-px bg-[#e65100]/10 flex-1"></div>
            </div>

            {/* Direct primary email button */}
            <a
              href={`mailto:${contattiConfig.info.email_value}`}
              className="clay-btn inline-flex items-center gap-2 px-8 py-4 font-bold transition-all text-sm uppercase tracking-wider"
            >
              Scrivici direttamente via email
              <ExternalLink className="w-4 h-4" />
            </a>
        </div>

        {/* Institutional info */}
        <div className="w-full clay-panel p-10 mt-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[#8a3a19] text-sm font-bold uppercase tracking-widest mb-2">{contattiConfig.info.email_label}</span>
              <a href={`mailto:${contattiConfig.info.email_value}`} className="text-xl md:text-2xl font-extrabold text-[#4a1c0d] hover:text-[#e65100] transition-colors">
                {contattiConfig.info.email_value}
              </a>
            </div>
            <div className="h-12 w-px bg-[#4a1c0d]/10 hidden md:block"></div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[#8a3a19] text-sm font-bold uppercase tracking-widest mb-2">{contattiConfig.info.phone_label}</span>
              <a href={`tel:${contattiConfig.info.phone_value.replace(/\s+/g, '')}`} className="text-xl md:text-2xl font-mono font-bold text-[#4a1c0d] hover:text-[#e65100] transition-colors">
                {contattiConfig.info.phone_value}
              </a>
            </div>
        </div>
      </div>
    </div>
  );
}
