import { Gamepad2, FileCheck, Calendar, ShieldCheck, Star, HelpCircle, Layers, CheckCircle } from "lucide-react";
import { SEO } from "../../components/SEO";
import { Button } from "../../components/ui/Button";

export default function MinecraftIstituti() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Minecraft Education per istituti scolastici",
    "description": "Progetto strutturato di Minecraft Education per scuole, dalla classe pilota al progetto d'istituto annuale.",
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
        title="Minecraft Education per Scuole e Istituti | Digital Heroes"
        description="Percorso strutturato per portare Minecraft Education nella programmazione scolastica. PNSD, PCTO e PTOF con gestione a nostro carico."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative bg-white border-2 border-brand-secondary p-8 sm:p-16 md:p-20 rounded-3xl shadow-[6px_6px_0_0_#1a1025] flex flex-col items-center text-center overflow-hidden mt-28 md:mt-36 max-w-6xl mx-auto w-full">
        <div className="relative z-10 max-w-4xl space-y-8 flex flex-col items-center">
          <span className="inline-block bg-blue-600 text-white border-2 border-brand-secondary px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest rounded-lg shadow-[3px_3px_0_0_#1a1025]">
            Per Istituti Scolastici
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[1.05] tracking-tight text-[#1a1025]">
            Minecraft Education come progetto d'istituto
          </h1>
          
          <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto text-[#1a1025]/80">
            Un percorso strutturato per portare Minecraft Education nella programmazione scolastica: dalla singola classe al progetto annuale, con materiali, reportistica e gestione completa a nostro carico.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3.5 items-center">
            <span className="bg-brand-bg border-2 border-brand-secondary px-4 py-2 rounded-full text-xs font-bold text-[#1a1025] uppercase shadow-[2px_2px_0_0_#1a1025]">3h+ Modulo base</span>
            <span className="bg-brand-bg border-2 border-brand-secondary px-4 py-2 rounded-full text-xs font-bold text-[#1a1025] uppercase shadow-[2px_2px_0_0_#1a1025]">100% Gestione inclusa</span>
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
              title: "Licenze e materiali",
              desc: "Disponibili su richiesta (opzionale) se l'istituto non ne è provvisto.",
              icon: <ShieldCheck className="w-8 h-8 text-blue-500" />
            },
            {
              title: "Calendario flessibile",
              desc: "Da un singolo incontro a un progetto distribuito sull'intero anno.",
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
            "Educatori con esperienza diretta in aula, non solo competenza tecnica.",
            "Percorso adattabile a PNSD, PCTO e progetti di educazione civica digitale.",
            "Possibilità di coinvolgere più classi o l'intero plesso con calendario condiviso."
          ].map((text, idx) => (
            <div key={idx} className="flex flex-col gap-4 items-center text-center bg-white p-8 border-2 border-brand-secondary rounded-2xl shadow-[4px_4px_0_0_#1a1025] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#cc7cf7] transition-all">
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
            <Gamepad2 className="w-10 h-10 text-yellow-300 mb-6" />
            <h3 className="text-2xl font-black uppercase mb-4">Progetto d'istituto</h3>
            <p className="font-medium text-white/90">Più classi, programmazione annuale, integrazione nel PTOF dell'istituto.</p>
          </div>
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
            "Il corso è molto interessante e divertente. Inoltre, i due insegnanti sono molto simpatici e spiegano bene."
          </p>
          <p className="text-sm font-black uppercase tracking-widest text-[#1a1025] text-center">
            — Samuele
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
              q: "Possiamo richiedere un preventivo formale per il consiglio d'istituto?",
              a: "Sì, prepariamo un documento dettagliato con costi, programma e modalità organizzative."
            },
            {
              q: "Il progetto rientra nei fondi PNSD?",
              a: "Sì, il percorso è strutturabile per rientrare nelle linee di finanziamento per la didattica digitale."
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
          Porta Minecraft Education nel tuo istituto
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
