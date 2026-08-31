import sostieniciConfig from "../config/sostienici.json";
import { ArrowLeft, ChevronRight, ChevronLeft, CreditCard, HandHeart, Landmark } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SEO } from "../components/SEO";
import { generateDonateActionSchema } from "../utils/seo-microdata";
import { organization } from "../config/organization";
import { CopyableValue } from "../components/CopyableValue";

type DonationStep = "intro" | "methods" | "bank";

function DonationCard() {
  const [step, setStep] = useState<DonationStep>("intro");
  const [paypalNotice, setPaypalNotice] = useState(false);
  const noticeTimer = useRef<number | undefined>(undefined);
  const reduceMotion = useReducedMotion();

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const showPaypalNotice = () => {
    setPaypalNotice(true);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setPaypalNotice(false), 3200);
  };

  const transition = reduceMotion ? { duration: 0 } : { duration: 0.24, ease: "easeOut" as const };
  const enter = reduceMotion ? {} : { opacity: 0, y: 12 };
  const exit = reduceMotion ? {} : { opacity: 0, y: -8 };
  const tileShape = { clipPath: "polygon(0 0, 100% 0, 92% 100%, 8% 100%)" };

  return (
    <section aria-labelledby="single-donation-title" className="max-w-2xl mx-auto mb-16 w-full">
      <div className="clay-card relative min-h-[31rem] overflow-hidden p-7 sm:p-10 md:p-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ffb300]/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-[#e65100]/10 blur-3xl" aria-hidden="true" />

        <AnimatePresence mode="wait" initial={false}>
          {step === "intro" && (
            <motion.div key="intro" initial={enter} animate={{ opacity: 1, y: 0 }} exit={exit} transition={transition} className="relative flex min-h-[25rem] flex-col">
              <div className="mb-9 flex size-20 items-center justify-center rounded-[1.65rem] bg-[#e65100]/12 text-[#e65100] shadow-[inset_3px_3px_8px_rgba(255,255,255,.7),3px_5px_12px_rgba(150,62,20,.12)]">
                <HandHeart className="size-10" strokeWidth={1.9} aria-hidden="true" />
              </div>
              <h2 id="single-donation-title" className="max-w-md text-4xl font-extrabold tracking-tight text-[#4a1c0d] text-balance sm:text-5xl">
                {sostieniciConfig.donation.title}
              </h2>
              <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-[#4a1c0d]/72">
                {sostieniciConfig.donation.description}
              </p>
              <button
                type="button"
                onClick={() => setStep("methods")}
                className="clay-btn mt-auto min-h-14 w-full px-7 py-4 text-base font-extrabold uppercase tracking-wider transition-transform hover:scale-[1.015] active:scale-[0.985] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e65100] touch-manipulation"
              >
                Fai una donazione
              </button>
            </motion.div>
          )}

          {step === "methods" && (
            <motion.div key="methods" initial={enter} animate={{ opacity: 1, y: 0 }} exit={exit} transition={transition} className="relative flex min-h-[25rem] flex-col">
              <button
                type="button"
                onClick={() => setStep("intro")}
                className="mb-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-2 text-sm font-bold text-[#8a3a19] transition-colors hover:text-[#e65100] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e65100]"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Indietro
              </button>
              <h2 id="single-donation-title" className="text-4xl font-extrabold tracking-tight text-[#4a1c0d] text-balance sm:text-5xl">
                {sostieniciConfig.donation.method_title}
              </h2>
              <p className="mt-4 text-lg font-medium leading-relaxed text-[#4a1c0d]/72">{sostieniciConfig.donation.method_description}</p>
              <div className="mt-10 grid gap-5 sm:grid-cols-2" role="group" aria-label="Metodo di donazione">
                <motion.button
                  type="button"
                  onClick={() => setStep("bank")}
                  whileHover={reduceMotion ? undefined : { scale: 1.025, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 360, damping: 24 }}
                  style={tileShape}
                  className="min-h-48 bg-[#198754] px-8 py-8 text-left text-white shadow-[0_14px_26px_rgba(25,135,84,.22)] transition-shadow hover:shadow-[0_20px_32px_rgba(25,135,84,.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#198754] touch-manipulation"
                >
                  <Landmark className="mb-7 size-8" strokeWidth={1.9} aria-hidden="true" />
                  <span className="block text-2xl font-extrabold tracking-tight">Bonifico</span>
                  <span className="mt-1 block text-sm font-bold text-white/78">Disponibile ora</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={showPaypalNotice}
                  aria-describedby={paypalNotice ? "paypal-notice" : undefined}
                  whileHover={reduceMotion ? undefined : { scale: 1.025, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 360, damping: 24 }}
                  style={tileShape}
                  className="min-h-48 bg-[#1769aa] px-8 py-8 text-left text-white shadow-[0_14px_26px_rgba(23,105,170,.22)] transition-shadow hover:shadow-[0_20px_32px_rgba(23,105,170,.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1769aa] touch-manipulation"
                >
                  <CreditCard className="mb-7 size-8" strokeWidth={1.9} aria-hidden="true" />
                  <span className="block text-2xl font-extrabold tracking-tight">PayPal</span>
                  <span className="mt-1 block text-sm font-bold text-white/78">{sostieniciConfig.donation.paypal_label}</span>
                </motion.button>
              </div>
              <AnimatePresence>
                {paypalNotice && (
                  <motion.p
                    id="paypal-notice"
                    role="status"
                    aria-live="polite"
                    initial={enter}
                    animate={{ opacity: 1, y: 0 }}
                    exit={exit}
                    transition={transition}
                    className="mt-6 rounded-2xl bg-[#1769aa]/10 px-5 py-4 text-sm font-semibold leading-relaxed text-[#124f80]"
                  >
                    {sostieniciConfig.donation.paypal_notice}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === "bank" && (
            <motion.div key="bank" initial={enter} animate={{ opacity: 1, y: 0 }} exit={exit} transition={transition} className="relative flex min-h-[25rem] flex-col">
              <button
                type="button"
                onClick={() => setStep("methods")}
                className="mb-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-2 text-sm font-bold text-[#8a3a19] transition-colors hover:text-[#e65100] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e65100]"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Metodi di donazione
              </button>
              <div className="mb-8 flex size-16 items-center justify-center rounded-[1.35rem] bg-[#198754]/12 text-[#198754] shadow-[inset_3px_3px_8px_rgba(255,255,255,.7),3px_5px_12px_rgba(25,135,84,.12)]">
                <Landmark className="size-8" strokeWidth={1.9} aria-hidden="true" />
              </div>
              <h2 id="single-donation-title" className="text-4xl font-extrabold tracking-tight text-[#4a1c0d] text-balance sm:text-5xl">Bonifico bancario</h2>
              <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-[#4a1c0d]/72">{sostieniciConfig.donation.bank_description}</p>
              <div className="mt-auto rounded-[1.6rem] border border-[#198754]/18 bg-[#198754]/8 p-5 sm:p-6">
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#176a43]">IBAN</span>
                <CopyableValue
                  value={organization.iban}
                  copyLabel="Copia IBAN"
                  actionLabel="Copia IBAN"
                  copiedLabel="IBAN copiato"
                  className="mt-2 max-w-full"
                  valueClassName="text-base sm:text-lg md:text-xl tracking-wide break-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export function Sostienici() {
  const schema = generateDonateActionSchema();
  const [currentProjectIdx, setCurrentProjectIdx] = useState(0);
  const donationRef = useRef<HTMLDivElement>(null);
  
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleCopyCF = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(organization.taxCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    triggerConfetti(e.clientX, e.clientY);
  };

  const triggerConfetti = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#ff8f00", "#e65100", "#ffb300", "#4a1c0d", "#8a3a19", "#ff424d"];
    const particles: any[] = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18 - 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
      });
    }

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45;
        p.vx *= 0.98;
        p.rotation += p.rotationSpeed;

        if (p.vy > 0) {
          p.opacity -= 0.015;
        }

        if (p.opacity > 0 && p.y < canvas.height) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (active) {
        requestAnimationFrame(update);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    update();
  };

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
              <button onClick={prevProject} className="p-3 clay-nav text-[#e65100] transition-all hover:bg-white/50 hover:scale-110 active:scale-95">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextProject} className="p-3 clay-nav text-[#e65100] transition-all hover:bg-white/50 hover:scale-110 active:scale-95">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="relative clay-card overflow-hidden grid">
            {sostieniciConfig.active_projects.map((proj, idx) => {
              const isActive = idx === currentProjectIdx;
              const isFutureItem = idx > 0;
              const opacityClass = isActive ? (isFutureItem ? 'opacity-80 z-10' : 'opacity-100 z-10') : 'opacity-0 z-0 pointer-events-none';
              const currentProgress = isFutureItem ? 0 : Math.min((proj.current_amount / proj.goal_amount) * 100, 100);

              return (
                <div
                  key={proj.id}
                  className={`col-start-1 row-start-1 flex flex-col lg:flex-row min-h-[500px] transition-opacity duration-500 ease-in-out ${opacityClass}`}
                >
                  {/* Image side */}
                  <div className="w-full lg:w-1/2 relative min-h-[250px] lg:min-h-full">
                    <img src={proj.image} alt={proj.title} className={`absolute inset-0 w-full h-full object-cover ${isFutureItem ? 'grayscale' : ''}`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent lg:bg-gradient-to-t"></div>
                    {isFutureItem && (
                      <div className="absolute top-8 left-8 clay-card-dark text-white px-6 py-2 font-bold uppercase tracking-widest text-sm shadow-xl">
                        Prossimamente
                      </div>
                    )}
                  </div>
                  
                  {/* Content side */}
                  <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                    <h3 className="text-4xl md:text-5xl font-extrabold text-[#4a1c0d] mb-6 leading-tight">{proj.title}</h3>
                    <p className="text-[#4a1c0d]/70 text-lg leading-relaxed font-medium mb-12 flex-1">
                      {proj.description}
                    </p>
                    
                    {/* Progress Bar Container */}
                    <div className="w-full mb-10">
                      <div className="flex justify-between items-end mb-4">
                        <div className="flex flex-col">
                          <span className="text-[#8a3a19] text-sm font-bold uppercase tracking-widest mb-1">
                            Raccolti
                          </span>
                          <span className="text-4xl font-mono font-extrabold text-[#e65100]">
                            €{proj.current_amount}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[#4a1c0d]/50 text-xs font-bold uppercase tracking-widest mb-1">Obiettivo</span>
                          <span className="text-xl font-mono font-bold text-[#4a1c0d]/70">€{proj.goal_amount}</span>
                        </div>
                      </div>
                      <div className="w-full h-5 bg-[#e65100]/10 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-[#e65100] to-[#ffb300] rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: isActive ? `${currentProgress}%` : '0%' }}
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
                </div>
              );
            })}
          </div>
        </div>



        {/* Support Options */}
        <div id="support-options" ref={donationRef} className="w-full flex flex-col items-center mb-16 pt-20">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-12 text-center text-[#4a1c0d]">
            Sostienici
          </h2>
        </div>
        <DonationCard />

        {/* Sezione 5 per Mille */}
        <div className="w-full flex flex-col items-center pt-8 pb-16 max-w-5xl mx-auto relative z-20">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="clay-card w-full p-12 md:p-20 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff8f00]/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e65100]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-16 h-16 bg-[#e65100]/10 text-[#e65100] rounded-full flex items-center justify-center mb-8 hover:scale-110 transition-transform duration-300 self-center aspect-square shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>

            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#4a1c0d] mb-6 leading-tight">
              Destina il tuo 5x1000 ad ABBO APS
            </h3>
            
            <p className="text-lg md:text-xl font-medium text-[#4a1c0d]/70 max-w-2xl leading-relaxed mb-10">
              Un gesto a costo zero per supportare i giovani. Con il tuo 5x1000 finanzi direttamente laboratori didattici di robotica, informatica e le attività sociali dell'officina in Brianza.
            </p>

            <div className="w-full max-w-md clay-input p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative group select-none">
              <div className="flex flex-col text-left w-full sm:w-auto">
                <span className="text-[10px] md:text-xs font-bold text-[#8a3a19] uppercase tracking-wider mb-1">Codice Fiscale dell'Associazione</span>
                <span className="font-mono text-xl md:text-2xl font-black text-[#e65100] tracking-wider select-all">{organization.taxCode}</span>
              </div>
              <button
                onClick={handleCopyCF}
                className="clay-btn w-full sm:w-auto px-6 py-3 font-extrabold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Copiato!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copia Codice
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ width: "100vw", height: "100vh" }}
      />
    </div>
  );
}
