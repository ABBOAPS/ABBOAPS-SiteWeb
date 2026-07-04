import { Cpu, Layers, Target, GraduationCap, Star, HelpCircle } from "lucide-react";
import { SEO } from "../../components/SEO";
import { Button } from "../../components/ui/Button";

export default function LegoDocenti() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Corso di Formazione Robotica Educativa per Insegnanti",
    "description": "Corso di formazione per docenti su Lego Spike. Impara a usare la robotica come strumento didattico in autonomia.",
    "provider": {
      "@type": "Organization",
      "name": "Digital Heroes",
      "sameAs": "https://digital-heroes.me"
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "teacher"
    },
    "inLanguage": "it",
    "areaServed": "Lombardia"
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-20 md:gap-28 p-4 sm:p-8 md:p-12 lg:p-16 bg-brand-bg text-[#1a1025]">
      <SEO
        title="Corso di Formazione Lego Spike per Insegnanti | Digital Heroes"
        description="Impari a usare la robotica educativa (Lego Spike) come strumento didattico, così da poterlo portare nelle tue classi quando vuoi, in totale autonomia."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative bg-white border-2 border-brand-secondary p-8 sm:p-16 md:p-20 rounded-3xl shadow-[6px_6px_0_0_#1a1025] flex flex-col items-center text-center overflow-hidden mt-28 md:mt-36 max-w-6xl mx-auto w-full">
        <div className="relative z-10 max-w-4xl space-y-8 flex flex-col items-center">
          <span className="inline-block bg-[#ff9f1c] text-white border-2 border-brand-secondary px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest rounded-lg shadow-[3px_3px_0_0_#1a1025]">
            Formazione per insegnanti
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[1.05] tracking-tight text-[#1a1025]">
            Impara a usare Lego Spike in autonomia
          </h1>
          
          <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto text-[#1a1025]/80">
            Acquisisci le competenze per integrare la robotica educativa nella tua didattica. Diventa autonomo nella progettazione delle lezioni e coinvolgi le tue classi senza bisogno di supporto esterno.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3.5 items-center">
            <span className="bg-brand-bg text-[#1a1025] border-2 border-brand-secondary px-4 py-2 rounded-full text-xs font-bold uppercase shadow-[2px_2px_0_0_#1a1025]">Nessuna competenza tecnica richiesta</span>
            <span className="bg-brand-bg text-[#1a1025] border-2 border-brand-secondary px-4 py-2 rounded-full text-xs font-bold uppercase shadow-[2px_2px_0_0_#1a1025]">Materiali didattici inclusi</span>
            <span className="bg-brand-bg text-[#1a1025] border-2 border-brand-secondary px-4 py-2 rounded-full text-xs font-bold uppercase shadow-[2px_2px_0_0_#1a1025]">Diventi autonomo</span>
          </div>

          <div className="pt-4">
            <a href="https://digital-heroes.me/scuole#contattaci">
              <Button variant="accent" size="lg" className="uppercase font-black tracking-widest shadow-[4px_4px_0_0_#1a1025] border-2 border-[#1a1025] bg-yellow-300 hover:bg-yellow-400 text-[#1a1025] py-5 px-10">
                Richiedi Informazioni
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Perché formarti su Lego Spike */}
      <section className="max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center md:text-left border-b-2 border-brand-secondary pb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#1a1025]">
            Perché formarti su Lego Spike
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Padronanza dello strumento",
              desc: "Impari l'interfaccia, i motori, i sensori e come strutturare un'attività efficace.",
              icon: <Cpu className="w-8 h-8 text-[#ff9f1c]" />
            },
            {
              title: "Progettazione didattica",
              desc: "Capisci come costruire obiettivi STEM chiari attorno all'assemblaggio dei robot.",
              icon: <Target className="w-8 h-8 text-blue-500" />
            },
            {
              title: "Gestione dei gruppi in laboratorio",
              desc: "Tecniche per coordinare la classe, gestire i kit e mantenere l'attenzione focalizzata sull'obiettivo.",
              icon: <Layers className="w-8 h-8 text-emerald-500" />
            },
            {
              title: "Versatilità STEM",
              desc: "Non solo coding: integra la robotica in scienze, matematica o tecnologia. Uno strumento flessibile per ogni docente.",
              icon: <GraduationCap className="w-8 h-8 text-[#cc7cf7]" />
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white text-[#1a1025] border-2 border-brand-secondary p-8 rounded-2xl shadow-[4px_4px_0_0_#1a1025] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#ff9f1c] transition-all flex flex-col gap-4">
              <div className="w-16 h-16 bg-brand-bg rounded-xl border-2 border-brand-secondary flex items-center justify-center shadow-[2px_2px_0_0_#1a1025]">
                {item.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">{item.title}</h3>
              <p className="text-[#1a1025]/80 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Come funziona il corso */}
      <section className="max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center md:text-left border-b-2 border-brand-secondary pb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#1a1025]">
            Come funziona il corso
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[
            {
              title: "Le basi di Lego Spike",
              desc: "Impari a muoverti nell'ambiente di programmazione a blocchi e le funzioni principali dei kit."
            },
            {
              title: "Costruisci la tua attività",
              desc: "Con il nostro educatore, prepari un'attività pratica concreta da usare con la tua classe."
            },
            {
              title: "Simulazione e feedback",
              desc: "Provi a condurre la lezione, ricevi indicazioni pratiche prima di portarla davvero in classe."
            }
          ].map((step, idx) => (
            <div key={idx} className="bg-white text-[#1a1025] border-2 border-brand-secondary p-6 sm:p-8 rounded-2xl shadow-[4px_4px_0_0_#1a1025] flex flex-col sm:flex-row gap-6 items-start hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#ff9f1c] transition-all">
              <div className="w-12 h-12 shrink-0 bg-[#ff9f1c] text-white font-black text-xl border-2 border-brand-secondary rounded-xl flex items-center justify-center shadow-[2px_2px_0_0_#1a1025]">
                {idx + 1}
              </div>
              <div>
                <h3 className="text-xl font-black uppercase mt-1 mb-2">{step.title}</h3>
                <p className="text-[#1a1025]/80 font-medium text-sm sm:text-base leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cosa porti via dal corso */}
      <section className="max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center md:text-left border-b-2 border-brand-secondary pb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#1a1025]">
            Cosa porti via dal corso
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {["Uso autonomo del kit", "Progettazione di attività", "Gestione dei gruppi in aula", "Valutazione degli obiettivi STEM", "Materiali pronti all'uso"].map((tag, idx) => (
            <span key={idx} className="bg-white border-2 border-brand-secondary px-4 py-2 rounded-lg text-sm font-bold uppercase shadow-[2px_2px_0_0_#1a1025] hover:-translate-y-1 transition-transform">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Recensione (Rotazione: Samuele) */}
      <section className="max-w-3xl mx-auto w-full">
        <div className="bg-white border-2 border-brand-secondary p-8 sm:p-10 rounded-2xl shadow-[4px_4px_0_0_#1a1025] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#ff9f1c] transition-all">
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
              q: "Devo avere già esperienza con i Lego Spike per iscrivermi?",
              a: "No, il corso parte da zero. Ti insegneremo tutto noi partendo dalle basi dell'assemblaggio fino alla programmazione a blocchi."
            },
            {
              q: "Dopo il corso sono davvero autonomo, o servono altre sessioni con voi?",
              a: "L'obiettivo del corso è proprio renderti autonomo. Restiamo comunque disponibili se hai bisogno di supporto successivo."
            },
            {
              q: "Il corso vale come formazione per l'aggiornamento professionale?",
              a: "Stiamo definendo le modalità di riconoscimento. Scrivici per le informazioni più aggiornate."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white border-2 border-brand-secondary p-6 rounded-2xl shadow-[2px_2px_0_0_#1a1025] flex gap-4 items-start hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#ff9f1c] transition-all">
              <HelpCircle className="w-6 h-6 text-[#ff9f1c] shrink-0 mt-1" />
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
        <div className="bg-orange-50 border-2 border-brand-secondary p-8 sm:p-12 rounded-3xl shadow-[6px_6px_0_0_#1a1025]">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[#1a1025]">
            Iscriviti al corso di formazione
          </h2>
          <p className="text-lg font-medium text-[#1a1025]/80 mb-8 max-w-2xl mx-auto">
            Diventa autonomo nell'insegnamento della robotica con Lego Spike.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://digital-heroes.me/scuole#contattaci" className="w-full sm:w-auto">
              <Button variant="accent" size="lg" className="w-full uppercase font-black tracking-widest shadow-[4px_4px_0_0_#1a1025] border-2 border-[#1a1025] bg-yellow-300 hover:bg-yellow-400 text-[#1a1025] py-5 px-10">
                Iscriviti Ora
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
