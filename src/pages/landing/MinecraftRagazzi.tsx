import { Gamepad2, Users, Lightbulb, Puzzle, Star, HelpCircle, MapPin, Clock, Tag } from "lucide-react";
import { SEO } from "../../components/SEO";
import { Button } from "../../components/ui/Button";

export default function MinecraftRagazzi() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Corso di Minecraft Educational per ragazzi",
    "description": "Laboratorio pratico di Minecraft Education a Mezzago per ragazzi dai 7 anni: logica, problem solving e lavoro di squadra.",
    "provider": {
      "@type": "Organization",
      "name": "Digital Heroes",
      "sameAs": "https://digital-heroes.me"
    },
    "offers": {
      "@type": "Offer",
      "price": "15",
      "priceCurrency": "EUR"
    },
    "location": {
      "@type": "Place",
      "name": "Lombardia",
      "address": { "@type": "PostalAddress", "addressRegion": "Lombardia", "addressCountry": "IT" }
    },
    "audience": { "@type": "Audience", "suggestedMinAge": 7 },
    "inLanguage": "it"
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-20 md:gap-28 p-4 sm:p-8 md:p-12 lg:p-16 bg-brand-bg text-[#1a1025]">
      <SEO
        title="Corso di Minecraft Educational | Digital Heroes"
        description="Laboratorio pratico di Minecraft per ragazzi dai 7 anni: logica, problem solving e lavoro di squadra. Workshop singolo 15€."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative bg-white border-2 border-brand-secondary p-8 sm:p-16 md:p-20 rounded-3xl shadow-[6px_6px_0_0_#1a1025] flex flex-col items-center text-center overflow-hidden mt-28 md:mt-36 max-w-6xl mx-auto w-full">
        <div className="relative z-10 max-w-4xl space-y-8 flex flex-col items-center">
          <span className="inline-block bg-[#cc7cf7] text-white border-2 border-brand-secondary px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest rounded-lg shadow-[3px_3px_0_0_#1a1025]">
            Per ragazzi dai 7 anni
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[1.05] tracking-tight text-[#1a1025]">
            Corso di Minecraft Educational
          </h1>
          
          <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto text-[#1a1025]/80">
            Tre ore in cui tuo figlio non gioca soltanto: costruisce, risolve problemi e impara a lavorare in squadra. Con un educatore che conosce il gioco e sa come trasformarlo in apprendimento.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3.5 items-center">
            <span className="flex items-center gap-2 bg-brand-bg border-2 border-brand-secondary px-4 py-2 rounded-full text-xs font-bold text-[#1a1025] uppercase shadow-[2px_2px_0_0_#1a1025]">
              <Users className="w-4 h-4 text-blue-500" /> Dai 7 anni
            </span>
            <span className="flex items-center gap-2 bg-brand-bg border-2 border-brand-secondary px-4 py-2 rounded-full text-xs font-bold text-[#1a1025] uppercase shadow-[2px_2px_0_0_#1a1025]">
              <Clock className="w-4 h-4 text-emerald-500" /> 3 ore
            </span>
          </div>
        </div>
      </section>

      {/* Prezzo e Dettagli */}
      <section className="max-w-4xl mx-auto w-full">
        <div className="bg-yellow-300 border-2 border-brand-secondary p-8 sm:p-10 rounded-3xl shadow-[6px_6px_0_0_#1a1025] flex flex-col md:flex-row items-center justify-between gap-8 hover:-translate-y-1 transition-transform">
          <div className="space-y-4 text-center md:text-left flex-1">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1a1025] bg-white px-3 py-1 border-2 border-[#1a1025] rounded-full">
              <Tag className="w-4 h-4" /> Workshop Singolo
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-[#1a1025]">€15 <span className="text-xl">/ partec.</span></h2>
            <p className="font-bold text-[#1a1025]/80 max-w-sm">Materiali e licenze del gioco inclusi nel prezzo.</p>
          </div>
          <div className="w-full md:w-auto shrink-0">
            <a href="https://digital-heroes.me/eventi">
              <Button variant="outline" size="lg" className="w-full bg-white border-2 border-[#1a1025] shadow-[4px_4px_0_0_#1a1025] hover:bg-brand-bg text-[#1a1025] uppercase font-black px-10 py-5">
                Vedi Date
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Cosa impara tuo figlio */}
      <section className="max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center md:text-left border-b-2 border-brand-secondary pb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#1a1025]">
            Cosa impara tuo figlio
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Logica e struttura",
              desc: "Impara a scomporre un obiettivo in fasi eseguibili, le basi del pensiero computazionale.",
              icon: <Lightbulb className="w-8 h-8 text-yellow-500" />
            },
            {
              title: "Lavoro di squadra",
              desc: "Costruisce insieme ad altri ragazzi, impara a negoziare idee e avanzare proposte.",
              icon: <Users className="w-8 h-8 text-blue-500" />
            },
            {
              title: "Problem solving",
              desc: "Ogni ostacolo nel gioco diventa un piccolo problema da risolvere con metodo.",
              icon: <Puzzle className="w-8 h-8 text-emerald-500" />
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border-2 border-brand-secondary p-8 rounded-2xl shadow-[4px_4px_0_0_#1a1025] hover:shadow-[6px_6px_0_0_#cc7cf7] hover:-translate-y-1 transition-all flex flex-col gap-4 relative">
              <div className="absolute -top-6 -right-2 text-6xl font-black opacity-10 text-brand-secondary pointer-events-none">
                0{idx + 1}
              </div>
              <div className="w-16 h-16 bg-brand-bg rounded-xl border-2 border-brand-secondary flex items-center justify-center shadow-[2px_2px_0_0_#1a1025] z-10">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black uppercase text-[#1a1025] tracking-tight mt-2 z-10">{item.title}</h3>
              <p className="text-[#1a1025]/80 font-medium z-10">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="https://digital-heroes.me/eventi">
            <Button variant="accent" size="lg" className="uppercase font-black tracking-widest shadow-[4px_4px_0_0_#1a1025] border-2 border-brand-secondary bg-yellow-300 hover:bg-yellow-400 text-[#1a1025] py-5 px-10">
              Prenota Ora
            </Button>
          </a>
        </div>
      </section>

      {/* Quote */}
      <section className="max-w-4xl mx-auto w-full">
        <div className="bg-brand-secondary text-brand-bg p-8 sm:p-12 rounded-3xl shadow-[6px_6px_0_0_#cc7cf7] text-center space-y-6">
          <Gamepad2 className="w-12 h-12 mx-auto text-[#cc7cf7]" />
          <p className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight">
            "Non c'è bisogno di sapere già programmare. Si parte da quello che i ragazzi amano fare, e da lì si costruisce tutto il resto."
          </p>
          <p className="font-bold text-[#cc7cf7] uppercase tracking-widest">— Digital Heroes</p>
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
            "Il laboratorio per me è stato molto bello e interessante. I ragazzi sono stati chiari, disponibili e, oltre ad insegnare, ci hanno anche fatto divertire tanto!"
          </p>
          <p className="text-sm font-black uppercase tracking-widest text-[#1a1025] text-center">
            — Emanuele
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
              q: "Mio figlio non ha mai giocato a Minecraft, può partecipare?",
              a: "Sì, il laboratorio è pensato anche per chi non l'ha mai usato. L'educatore segue ogni ragazzo individualmente."
            },
            {
              q: "Serve portare un computer da casa?",
              a: "In fase di iscrizione è possibile richiedere una delle nostre postazioni gratuite (fino a esaurimento). Se avete un PC a casa, vi chiediamo cortesemente di portarlo per permettere a tutti di partecipare!"
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white border-2 border-brand-secondary p-6 rounded-2xl shadow-[2px_2px_0_0_#1a1025] flex gap-4 items-start">
              <HelpCircle className="w-6 h-6 text-[#cc7cf7] shrink-0 mt-1" />
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
          Prenota il posto per il prossimo workshop
        </h2>
        <p className="text-lg font-medium text-[#1a1025]/80 mb-8">
          Scegli la data che preferisci tra i prossimi eventi in programma.
        </p>
        <a href="https://digital-heroes.me/eventi">
          <Button variant="accent" size="lg" className="w-full sm:w-auto uppercase font-black tracking-widest shadow-[4px_4px_0_0_#1a1025] border-2 border-brand-secondary bg-[#cc7cf7] hover:bg-[#b86ce0] text-white py-5 px-10">
            Vai agli Eventi
          </Button>
        </a>
      </section>
    </div>
  );
}
