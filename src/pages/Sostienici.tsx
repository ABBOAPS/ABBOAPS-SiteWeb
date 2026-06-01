import sostieniciConfig from "../config/sostienici.json";
import { Check, ChevronRight, ChevronLeft, Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SEO } from "../components/SEO";
import { generateDonateActionSchema } from "../utils/seo-microdata";

// Define Patron Interface
interface Patron {
  id: string;
  name: string;
  imageUrl: string;
}

export function Sostienici() {
  const schema = generateDonateActionSchema();
  const [currentProjectIdx, setCurrentProjectIdx] = useState(0);
  const donationRef = useRef<HTMLDivElement>(null);
  
  // Patron State
  const [patrons, setPatrons] = useState<Patron[]>([]);
  const [patronsError, setPatronsError] = useState<string | null>(null);
  const [isLoadingPatrons, setIsLoadingPatrons] = useState(true);

  useEffect(() => {
    // Fetch patrons directly from the static file generated at build time
    fetch("./patrons.json")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setPatrons(data.patrons || []);
      })
      .catch((err) => {
        console.error("Error loading patrons:", err);
        setPatronsError("Nessun patron da caricare. Aggiungi il token di Patreon ai secrets di Github per generarli in production.");
      })
      .finally(() => setIsLoadingPatrons(false));
  }, []);

  const nextProject = () => {
    setCurrentProjectIdx((prev) => (prev + 1) % sostieniciConfig.active_projects.length);
  };

  const prevProject = () => {
    setCurrentProjectIdx((prev) => (prev - 1 + sostieniciConfig.active_projects.length) % sostieniciConfig.active_projects.length);
  };

  const scrollToDonation = () => {
    donationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const project = sostieniciConfig.active_projects[currentProjectIdx];
  const isFuture = currentProjectIdx > 0;
  // Make progress 0 for future or calculate
  const progress = isFuture ? 0 : Math.min((project.current_amount / project.goal_amount) * 100, 100);

  return (
    <div className="relative z-20 w-full min-h-screen pt-40 px-6 md:px-24 flex flex-col pb-48 text-[#4a1c0d]">
      <SEO 
        title="Sostienici | Donazioni e Volontariato ABBO APS" 
        description="Supporta i progetti giovanili di ABBO APS. Unisciti a noi o dona materiale per la nostra officina sociale in Brianza. Costruiamo assieme il futuro."
        url="/sostienici"
      >
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </SEO>
      <div className="max-w-6xl mx-auto w-full flex-1">
        {/* Sostienici Header */}
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-10 text-center text-[#4a1c0d]">
          {sostieniciConfig.title}
        </h1>
        <div className="flex justify-center mb-24">
          <h2 className="text-xl font-medium tracking-tight text-[#8a3a19] max-w-2xl text-center leading-relaxed">
             {sostieniciConfig.subtitle}
          </h2>
        </div>

        {/* I Nostri Progetti Attivi Slider */}
        <div className="mb-40">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-[#4a1c0d]">
              I Nostri Progetti
            </h2>
            <div className="flex items-center gap-4">
              <button onClick={prevProject} className="p-3 clay-nav text-[#e65100] transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextProject} className="p-3 clay-nav text-[#e65100] transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="relative clay-card overflow-hidden">
             <AnimatePresence mode="wait">
               <motion.div
                 key={currentProjectIdx}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.2 }}
                 className={`flex flex-col lg:flex-row min-h-[500px] ${isFuture ? 'opacity-80' : ''}`}
               >
                 {/* Image side */}
                 <div className="w-full lg:w-1/2 relative min-h-[250px] lg:min-h-full">
                   <img src={project.image} alt={project.title} className={`absolute inset-0 w-full h-full object-cover ${isFuture ? 'grayscale' : ''}`} />
                   <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent lg:bg-gradient-to-t"></div>
                   {isFuture && (
                     <div className="absolute top-8 left-8 clay-card-dark text-white px-6 py-2 font-bold uppercase tracking-widest text-sm shadow-xl">
                       Prossimamente
                     </div>
                   )}
                 </div>
                 
                 {/* Content side */}
                  <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                    <h3 className="text-4xl md:text-5xl font-extrabold text-[#4a1c0d] mb-6 leading-tight">{project.title}</h3>
                    <p className="text-[#4a1c0d]/70 text-lg leading-relaxed font-medium mb-12 flex-1">
                      {project.description}
                    </p>
                    
                    {/* Progress Bar Container */}
                    <div className="w-full mb-10">
                      <div className="flex justify-between items-end mb-4">
                        <div className="flex flex-col">
                          <span className="text-[#8a3a19] text-sm font-bold uppercase tracking-widest mb-1">
                            Raccolti
                          </span>
                          <span className="text-4xl font-mono font-extrabold text-[#e65100]">
                            €{project.current_amount}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[#4a1c0d]/50 text-xs font-bold uppercase tracking-widest mb-1">Obiettivo</span>
                          <span className="text-xl font-mono font-bold text-[#4a1c0d]/70">€{project.goal_amount}</span>
                        </div>
                      </div>
                      <div className="w-full h-5 bg-[#e65100]/10 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-[#e65100] to-[#ffb300] rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <button 
                      onClick={scrollToDonation}
                      className={`clay-btn px-8 py-5 font-bold uppercase tracking-widest transition-all w-full md:w-auto self-start hover:scale-105`}
                    >
                      Sostienici Ora
                    </button>
                 </div>
               </motion.div>
             </AnimatePresence>
          </div>
        </div>

        {/* I Nostri Mecenati (Patreon Wall) */}
        {!isLoadingPatrons && !patronsError && patrons.length > 0 && (
          <div className="w-full flex flex-col mb-32 pt-16 border-t border-[#4a1c0d]/10">
            <div className="flex flex-col items-center mb-16 text-center">
              <Heart className="w-12 h-12 text-[#ff424d] mb-6 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-[#4a1c0d]">
                I Nostri Mecenati
              </h2>
              <p className="text-xl font-medium tracking-tight text-[#4a1c0d]/70 max-w-2xl text-center leading-relaxed mb-8">
                Un ringraziamento speciale a chi sostiene la nostra missione ogni mese su Patreon.
              </p>
              <button 
                onClick={scrollToDonation}
                className="clay-btn px-8 py-4 font-bold uppercase tracking-widest text-white transition-all hover:scale-105"
              >
                Diventa un mecenate
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {patrons.map((patron) => (
                <motion.div
                  key={patron.id}
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden clay-card p-1 shadow-lg border-2 border-[#ff424d]/20 hover:border-[#ff424d] transition-colors">
                    <img 
                      src={patron.imageUrl} 
                      alt={`Mecenate ${patron.name}`} 
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-sm font-extrabold text-[#4a1c0d] text-center max-w-full truncate px-2">
                      {patron.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Support Options */}
        <div id="support-options" ref={donationRef} className="w-full flex flex-col items-center mb-16 pt-20">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-12 text-center text-[#4a1c0d]">
            Sostienici
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Patron Card (Ricorrente) */}
          <div className="clay-card flex flex-col p-10 md:p-14 relative overflow-hidden group">
            <div className="w-16 h-16 bg-[#ff424d]/10 text-[#ff424d] rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.3859 0.000183105C11.5362 0.000183105 8.41406 3.12242 8.41406 6.97204C8.41406 10.8217 11.5362 13.9439 15.3859 13.9439C19.2355 13.9439 22.3577 10.8217 22.3577 6.97204C22.3577 3.12242 19.2355 0.000183105 15.3859 0.000183105ZM1.6416 23.9998H6.12643V0.000183105H1.6416V23.9998Z"/>
              </svg>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-[#4a1c0d]">
              {sostieniciConfig.patreon.title}
            </h2>
            <p className="text-[#4a1c0d]/70 mb-8 leading-relaxed font-medium text-lg">
              {sostieniciConfig.patreon.description}
            </p>

            <ul className="mb-12 space-y-4">
              {sostieniciConfig.patreon.perks.map((perk, i) => (
                <li key={i} className="flex items-start space-x-3 text-[#4a1c0d]/80 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-[#ff424d]/20 flex items-center justify-center text-[#ff424d] shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{perk}</span>
                </li>
             ))}
            </ul>

            <a
              href={sostieniciConfig.patreon.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto clay-btn px-8 py-5 text-center text-white font-bold tracking-widest uppercase w-full"
            >
              Donazione Ricorrente
            </a>
          </div>

          {/* PayPal Card (Singola) */}
          <div className="clay-card flex flex-col p-10 md:p-14 relative overflow-hidden group">
            <div className="w-16 h-16 bg-[#0070ba]/10 text-[#0070ba] rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.07593 21.3368H2.47036C2.11586 21.3368 1.8385 21.0366 1.88414 20.6865L4.94507 0.90098C4.99613 0.589886 5.25052 0.351562 5.56942 0.351562H13.6111C18.2173 0.351562 20.9859 2.47953 20.1666 7.29415C19.6481 10.331 17.5492 12.6661 14.5772 13.5505C13.4704 13.8797 12.2614 14.0322 10.6575 14.0322H9.0275C8.68128 14.0322 8.3887 14.2858 8.33496 14.629L7.07593 21.3368Z" fill="#003087"/>
                <path d="M6.09635 15.0635C6.14856 14.7262 6.43632 14.4828 6.77884 14.4828H8.40884C10.0128 14.4828 11.2217 14.3291 12.3286 13.9996C15.3006 13.1143 17.398 10.7797 17.9179 7.74238C18.1783 6.22295 18.0658 4.91263 17.6206 3.86043C17.3362 3.19236 16.913 2.63428 16.3621 2.20459C15.5492 1.5 14.5034 1 13.0645 1H5.73359C5.6416 1 5.55938 0.0654316 5.53763 0.154546L2.19794 19.7941C2.18306 19.8808 2.25014 19.9577 2.33855 19.9577H6.49129C6.61394 19.9577 6.71804 19.8696 6.73693 19.747L6.09635 15.0635Z" fill="#0070ba"/>
                <path d="M16.9452 2.19828C17.4956 2.62846 17.9538 3.22416 18.2016 3.8533C18.647 4.90422 18.7909 6.2131 18.5292 7.7303C18.0105 10.7628 15.9126 13.097 12.9416 13.9818C11.8354 14.3106 10.6272 14.4636 9.02409 14.4636H7.39486C7.054 14.4636 6.76495 14.7077 6.71285 15.045L5.4542 21.7516H9.03541C9.36306 21.7516 9.64547 21.4998 9.69785 21.1764L10.5907 15.9169C10.6441 15.6009 10.9167 15.3676 11.2372 15.3676H12.4005C16.5137 15.3676 19.3041 13.4308 20.0438 9.10656C20.1989 8.19693 20.179 7.35805 19.9992 6.62174C19.7342 5.53177 18.9598 4.72149 17.8041 4.12097C16.403 3.3913 14.4754 3.27092 12.4187 3.27092H10.2828L10.0177 4.82115C10.3934 4.83615 10.7709 4.85415 11.155 4.88815C12.285 5.03185 13.208 5.23685 13.978 5.68825V5.68725L16.9452 2.19828Z" fill="#012169"/>
              </svg>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-[#4a1c0d]">
              {sostieniciConfig.paypal.title}
            </h2>
            <p className="text-[#4a1c0d]/70 mb-8 leading-relaxed font-medium text-lg">
              {sostieniciConfig.paypal.description}
            </p>

            <ul className="mb-12 space-y-4">
              {sostieniciConfig.paypal.perks.map((perk, i) => (
                <li key={i} className="flex items-start space-x-3 text-[#4a1c0d]/80 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-[#0070ba]/20 flex items-center justify-center text-[#0070ba] shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{perk}</span>
                </li>
             ))}
            </ul>

            <a
              href={sostieniciConfig.paypal.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto clay-btn px-8 py-5 text-center text-white font-bold tracking-widest uppercase w-full"
            >
              Donazione Singola (Una Tantum)
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}


