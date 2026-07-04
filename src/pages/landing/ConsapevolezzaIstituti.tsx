import { Shield, FileCheck, Calendar, Globe, Star, HelpCircle, Layers, CheckCircle } from "lucide-react";
import { SEO } from "../../components/SEO";
import { Button } from "../../components/ui/Button";

export default function ConsapevolezzaIstituti() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Consapevolezza Digitale per istituti scolastici",
    "description": "Progetto strutturato di educazione civica digitale per scuole, dalla classe pilota al progetto d'istituto annuale.",
    "provider": {
      "@type": "Organization",
      "name": "Digital Heroes",
      "sameAs": "https://digital-heroes.me"
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "school administrator"
    },
    "offers": {
      "@type": "Offer",
      "category": "B2B"
    },
    "inLanguage": "it",
    "areaServed": "Lombardia"
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-20 md:gap-28 p-4 sm:p-8 md:p-12 lg:p-16 bg-brand-bg text-[#1a1025]">
      <SEO
        title="Consapevolezza Digitale per Istituti | Digital Heroes"
        description="Percorso strutturato di educazione civica digitale per la scuola: IA, privacy, fake news e uso critico."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative bg-white border-2 border-brand-secondary p-8 sm:p-16 md:p-20 rounded-3xl shadow-[6px_6px_0_0_#1a1025] flex flex-col items-center text-center overflow-hidden mt-28 md:mt-36 max-w-6xl mx-auto w-full">
        <div className="relative z-10 max-w-4xl space-y-8 flex flex-col items-center">
          <span className="inline-block bg-blue-600 text-white border-2 border-brand-secondary px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest rounded-lg shadow-[3px_3px_0_0_#1a1025]">
            Per Istituti Scolastici
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[1.05] tracking-tight text-[#1a1025]">
            Consapevolezza digitale come progetto d'istituto
          </h1>
          
          <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto text-[#1a1025]/80">
            Un percorso strutturato di educazione civica digitale per la scuola: IA, privacy, fake news e uso critico degli strumenti digitali, con materiali, reportistica e gestione completa a nostro carico.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3.5 items-center">
            <span className="bg-brand-bg border-2 border-brand-secondary px-4 py-2 rounded-full text-xs font-bold text-[#1a1025] uppercase shadow-[2px_2px_0_0_#1a1025]">3h+ Modulo base</span>
            <span className="bg-brand-bg border-2 border-brand-secondary px-4 py-2 rounded-full text-xs font-bold text-[#1a1025] uppercase shadow-[2px_2px_0_0_#1a1025]">8 Temi disponibili</span>
          </div>
        </div>
      </section>

      {/* Cosa offriamo all'istituto */}
      <section className="max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center md:text-left border-b-2 border-brand-secondary pb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#1a1025]">
            Cosa offriamo all'istituto
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Temi su misura",
              desc: "Scegliete con noi gli argomenti più rilevanti: IA, privacy, fake news, cyberbullismo.",
              icon: <Shield className="w-8 h-8 text-blue-500" />
            },
            {
              title: "Calendario flessibile",
              desc: "Da un singolo incontro a un progetto distribuito sull'intero anno scolastico.",
              icon: <Calendar className="w-8 h-8 text-emerald-500" />
            },
            {
              title: "Documentazione per il PTOF",
              desc: "Report finale utilizzabile per la rendicontazione e il piano triennale.",
              icon: <FileCheck className="w-8 h-8 text-[#cc7cf7]" />
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border-2 border-brand-secondary p-8 rounded-2xl shadow-[4px_4px_0_0_#1a1025] hover:shadow-[6px_6px_0_0_#cc7cf7] hover:-translate-y-1 transition-all flex flex-col gap-4">
              <div className="w-16 h-16 bg-brand-bg rounded-xl border-2 border-brand-secondary flex items-center justify-center shadow-[2px_2px_0_0_#1a1025]">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black uppercase text-[#1a1025] tracking-tight">{item.title}</h3>
              <p className="text-[#1a1025]/80 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Conformità e organizzazione */}
      <section className="max-w-5xl mx-auto w-full bg-[#f0f8ff] border-2 border-brand-secondary p-8 sm:p-12 rounded-3xl shadow-[6px_6px_0_0_#1a1025] space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Conformità e organizzazione</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "Percorso allineato alle linee guida ministeriali su educazione civica digitale.",
            "Adattabile a PNSD, PCTO e progetti di cittadinanza digitale dell'istituto.",
            "Possibilità di coinvolgere più classi con calendario condiviso."
          ].map((text, idx) => (
            <div key={idx} className="flex flex-col gap-4 items-center text-center bg-white p-8 border-2 border-brand-secondary rounded-2xl shadow-[4px_4px_0_0_#1a1025] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#10b981] transition-all">
              <CheckCircle className="w-10 h-10 text-emerald-500 shrink-0" />
              <p className="font-bold text-[#1a1025]/90 text-base leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Due modi per iniziare */}
      <section className="max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center md:text-left border-b-2 border-brand-secondary pb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#1a1025]">
            Due modi per iniziare
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border-2 border-brand-secondary p-8 rounded-2xl shadow-[4px_4px_0_0_#1a1025]">
            <Layers className="w-10 h-10 text-orange-500 mb-6" />
            <h3 className="text-2xl font-black uppercase text-[#1a1025] mb-4">Progetto pilota</h3>
            <p className="text-[#1a1025]/80 font-medium">Una classe, un workshop. Per valutare l'impatto prima di estendere il progetto.</p>
          </div>
          <div className="bg-[#cc7cf7] text-white border-2 border-brand-secondary p-8 rounded-2xl shadow-[4px_4px_0_0_#1a1025]">
            <Globe className="w-10 h-10 text-yellow-300 mb-6" />
            <h3 className="text-2xl font-black uppercase mb-4">Progetto d'istituto</h3>
            <p className="font-medium text-white/90">Più classi, programmazione annuale, integrazione nel PTOF dell'istituto.</p>
          </div>
        </div>
      </section>

      {/* Temi disponibili */}
      <section className="max-w-6xl mx-auto w-full text-center">
        <h3 className="text-2xl font-black uppercase mb-6">Temi disponibili</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {["Intelligenza artificiale", "Privacy online", "Fake news", "Cyberbullismo", "Identità digitale", "Social media", "Blockchain e Bitcoin", "Sicurezza informatica"].map(tag => (
            <span key={tag} className="bg-white border-2 border-brand-secondary px-4 py-2 rounded-lg text-sm font-bold uppercase shadow-[2px_2px_0_0_#1a1025]">{tag}</span>
          ))}
        </div>
      </section>

      {/* Recensione */}
      <section className="max-w-3xl mx-auto w-full">
        <div className="bg-white border-2 border-brand-secondary p-8 sm:p-10 rounded-2xl shadow-[4px_4px_0_0_#1a1025]">
          <div className="flex justify-center gap-2 text-yellow-400 mb-6">
            <Star className="w-6 h-6 fill-current" />
            <Star className="w-6 h-6 fill-current" />
            <Star className="w-6 h-6 fill-current" />
            <Star className="w-6 h-6 fill-current" />
            <Star className="w-6 h-6 fill-current" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-[#1a1025]/90 italic text-center mb-6 leading-relaxed">
            "È stato bello perché ti permette di esprimere tutta la tua creatività."
          </p>
          <p className="text-sm font-black uppercase tracking-widest text-[#1a1025] text-center">
            — Agatha
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Domande frequenti</h2>
        </div>
        
        <div className="space-y-6">
          {[
            {
              q: "Il percorso copre i requisiti dell'educazione civica?",
              a: "Sì, i temi trattati si integrano con le linee guida ministeriali sulla cittadinanza digitale."
            },
            {
              q: "Possiamo richiedere un preventivo formale per il consiglio d'istituto?",
              a: "Sì, prepariamo un documento dettagliato con costi, programma e modalità organizzative."
            },
            {
              q: "Possiamo coinvolgere più sezioni contemporaneamente?",
              a: "Sì, organizziamo sessioni parallele o in rotazione in base agli spazi disponibili."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white border-2 border-brand-secondary p-6 rounded-2xl shadow-[2px_2px_0_0_#1a1025] flex gap-4 items-start">
              <HelpCircle className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-black text-lg uppercase text-[#1a1025]">{faq.q}</h4>
                <p className="text-[#1a1025]/80 font-medium mt-2">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto w-full text-center pb-12">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
          Porta la consapevolezza digitale nel tuo istituto
        </h2>
        <p className="text-lg font-medium text-[#1a1025]/80 mb-8">
          Richiedi un preventivo formale da presentare in consiglio o in segreteria.
        </p>
        <a href="https://digital-heroes.me/scuole#contattaci">
          <Button variant="accent" size="lg" className="w-full sm:w-auto uppercase font-black tracking-widest shadow-[4px_4px_0_0_#1a1025] border-2 border-brand-secondary bg-yellow-300 hover:bg-yellow-400 text-[#1a1025] py-5 px-10">
            Richiedi Preventivo
          </Button>
        </a>
      </section>
    </div>
  );
}
