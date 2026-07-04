import { MessageSquare, ShieldCheck, HeartHandshake, Eye, Star, HelpCircle, Tag, Smartphone } from "lucide-react";
import { SEO } from "../../components/SEO";
import { Button } from "../../components/ui/Button";

export default function ConsapevolezzaRagazzi() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Corso di Educazione Civica Digitale per ragazzi",
    "description": "Laboratorio pratico per ragazzi dai 9 anni sull'uso consapevole dei social network, la privacy e la difesa dalle fake news.",
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
    "audience": { "@type": "Audience", "suggestedMinAge": 9 },
    "inLanguage": "it"
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-20 md:gap-28 p-4 sm:p-8 md:p-12 lg:p-16 bg-brand-bg text-[#1a1025]">
      <SEO
        title="Corso di Educazione Civica Digitale | Digital Heroes"
        description="Laboratorio pratico per ragazzi dai 9 anni sull'uso consapevole dei social network, cyberbullismo e fake news. Workshop singolo 15€."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative bg-white border-2 border-brand-secondary p-8 sm:p-16 md:p-20 rounded-3xl shadow-[6px_6px_0_0_#1a1025] flex flex-col items-center text-center overflow-hidden mt-28 md:mt-36 max-w-6xl mx-auto w-full">
        <div className="relative z-10 max-w-4xl space-y-8 flex flex-col items-center">
          <span className="inline-block bg-[#10b981] text-white border-2 border-brand-secondary px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest rounded-lg shadow-[3px_3px_0_0_#1a1025]">
            Per ragazzi dai 9 anni
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[1.05] tracking-tight text-[#1a1025]">
            Corso di Educazione Civica Digitale
          </h1>
          
          <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto text-[#1a1025]/80">
            Tre ore in cui tuo figlio impara a riconoscere le fake news, a proteggersi online e a usare i social network in modo sano e costruttivo, senza fare "terrorismo psicologico".
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3.5 items-center">
            <span className="flex items-center gap-2 bg-brand-bg border-2 border-brand-secondary px-4 py-2 rounded-full text-xs font-bold text-[#1a1025] uppercase shadow-[2px_2px_0_0_#1a1025]">
              <Eye className="w-4 h-4 text-blue-500" /> Dai 9 anni
            </span>
            <span className="flex items-center gap-2 bg-brand-bg border-2 border-brand-secondary px-4 py-2 rounded-full text-xs font-bold text-[#1a1025] uppercase shadow-[2px_2px_0_0_#1a1025]">
              <MessageSquare className="w-4 h-4 text-emerald-500" /> Focus Social Network
            </span>
          </div>
        </div>
      </section>

      {/* Prezzo e Dettagli */}
      <section className="max-w-4xl mx-auto w-full">
        <div className="bg-[#f0fff4] border-2 border-brand-secondary p-8 sm:p-10 rounded-3xl shadow-[6px_6px_0_0_#1a1025] flex flex-col md:flex-row items-center justify-between gap-8 hover:-translate-y-1 transition-transform">
          <div className="space-y-4 text-center md:text-left flex-1">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1a1025] bg-white px-3 py-1 border-2 border-[#1a1025] rounded-full">
              <Tag className="w-4 h-4" /> Workshop Singolo
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-[#1a1025]">€15 <span className="text-xl">/ partec.</span></h2>
            <p className="font-bold text-[#1a1025]/80 max-w-sm">Materiali e dispense esclusive per genitori inclusi nel prezzo.</p>
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
              title: "Uso dei Social Network",
              desc: "Come proteggere la propria immagine online, gestire i commenti e riconoscere relazioni digitali sane.",
              icon: <Smartphone className="w-8 h-8 text-blue-500" />
            },
            {
              title: "Sicurezza e Privacy",
              desc: "Impara a difendere i propri dati personali, riconoscere truffe, phishing e individuare le fake news.",
              icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />
            },
            {
              title: "Comportamento Etico",
              desc: "Sviluppa empatia digitale: come prevenire, riconoscere e difendersi dal cyberbullismo.",
              icon: <HeartHandshake className="w-8 h-8 text-red-500" />
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border-2 border-brand-secondary p-8 rounded-2xl shadow-[4px_4px_0_0_#1a1025] hover:shadow-[6px_6px_0_0_#10b981] hover:-translate-y-1 transition-all flex flex-col gap-4 relative">
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

      {/* Recensione (Rotazione: Agatha) */}
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
              q: "Mio figlio deve portare lo smartphone o un PC da casa?",
              a: "Se lo possiede può portarlo, altrimenti lavoreremo su dispositivi forniti da noi (laptop o tablet)."
            },
            {
              q: "Il corso spaventa i ragazzi sui pericoli di internet?",
              a: "Assolutamente no! Il nostro approccio è costruttivo: non facciamo terrorismo psicologico, ma insegniamo a usare gli strumenti in modo sano e a trasformare internet in un'opportunità sicura."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white border-2 border-brand-secondary p-6 rounded-2xl shadow-[2px_2px_0_0_#1a1025] flex gap-4 items-start">
              <HelpCircle className="w-6 h-6 text-[#10b981] shrink-0 mt-1" />
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
          <Button variant="accent" size="lg" className="w-full sm:w-auto uppercase font-black tracking-widest shadow-[4px_4px_0_0_#1a1025] border-2 border-brand-secondary bg-[#10b981] hover:bg-emerald-600 text-white py-5 px-10">
            Vai agli Eventi
          </Button>
        </a>
      </section>
    </div>
  );
}
