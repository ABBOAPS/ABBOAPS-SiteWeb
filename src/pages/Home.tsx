import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "motion/react";
import { Project } from "../types";
import projectData from "../config/projects.json";
import homeConfig from "../config/home.json";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { generateNgoSchema } from "../utils/seo-microdata";
import { dataNews } from "../data/newsData";

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      layoutId={`project-container-${project.id}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className="clay-card p-0 cursor-pointer relative w-full md:w-[45%] lg:w-[40%] aspect-[4/5] flex flex-col items-center justify-end group overflow-hidden rounded-[2.5rem] shadow-2xl hover:shadow-3xl transition-all duration-500 border-4 border-white/50"
    >
      <div className="absolute inset-0 z-0 bg-[#1a0a05]">
        <img src={project.bg_src} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a0e05]/95 via-[#2a0e05]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>

        {/* Spotlight Effect overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 252, 245, 0.15),
                transparent 60%
              )
            `,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-end p-8 w-full h-full gap-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
        <motion.img
          layoutId={`project-icon-${project.id}`}
          src={project.icon}
          alt={project.title}
          className={`object-contain drop-shadow-2xl group-hover:scale-110 transition-all duration-500 max-w-[80%] ${project.title === "Digital Heroes" ? "h-32 md:h-48" : project.title === "MyVanilla" ? "h-28 md:h-40" : "h-24 md:h-32"}`}
        />
        
        {/* Title and Description - Hidden by default, fade in on hover */}
        <div className="flex flex-col items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <p className="text-white/90 font-medium text-sm md:text-base line-clamp-3 px-4 drop-shadow-md">
            {project.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Home() {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const partnerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const jsonLd = generateNgoSchema();

  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCopyCF = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText("#########");
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

  const handleScrollDown = () => {
    if (projectsRef.current) {
      projectsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const recentNews = [...dataNews].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 3);

  // Filter out the hero item if it's mixed with projects
  const actualProjects = (projectData as Project[]).filter(p => p.id !== "hero-air");
  const activeProject = actualProjects.find((p) => p.id === expandedProjectId);

  return (
    <>
      <SEO
        title="Diamo sostanza ai progetti per i giovani"
        description="Siamo un'officina sociale in Brianza. Forniamo strutture solide per resistere al tempo, supportando giovani, open source e reti territoriali a Monza, Lecco, Bergamo e Milano."
        url="/"
      >
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </SEO>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          animation: marquee 130s linear infinite;
        }
      `}</style>
      {/* Hero Section */}
      <main className="relative z-20 w-full min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={homeConfig.hero_background || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564"} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-md"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#ff8f00]/10 via-[#fffcf5]/40 to-[#fffaf0]"></div>
        </div>
        <div className="flex flex-col items-center pt-24 relative z-10">
          <motion.img
            src={homeConfig.association_logo}
            alt="ABBO APS Logo"
            width={192}
            height={192}
            className="w-48 h-48 mb-6 object-contain drop-shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#4a1c0d] drop-shadow-md text-center max-w-2xl px-6">
              Creiamo i momenti a cui vorresti tornare
            </h1>
          </motion.div>

          <motion.button
            onClick={handleScrollDown}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            aria-label="Scorri verso i progetti"
            className="group mt-2 flex flex-col items-center space-y-4 cursor-pointer"
          >
            <div className="w-8 h-12 clay-input flex flex-col items-center pt-2 overflow-hidden">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-3 bg-[#e65100] rounded-full drop-shadow-md"
              />
            </div>
          </motion.button>
        </div>
      </main>

      {/* Content Section Below Fold */}
      <div className="relative z-30 min-h-screen w-full flex flex-col items-center justify-start pb-48 text-[#4a1c0d] overflow-x-hidden">
        <div className="w-full max-w-7xl flex flex-col items-center px-6">

          {/* I Nostri Progetti */}
          <div ref={projectsRef} className="w-full mb-32 pt-24 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-16 text-center text-[#4a1c0d]">
              I Nostri Progetti
            </h2>

            <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-8 md:gap-12 w-full relative max-w-6xl mx-auto">
              {actualProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onClick={() => setExpandedProjectId(project.id)} />
              ))}
            </div>

            <AnimatePresence>
              {activeProject && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setExpandedProjectId(null)}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] cursor-pointer"
                  />
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 pointer-events-none">
                    <motion.div
                      layoutId={`project-container-${activeProject.id}`}
                      className="clay-card relative flex flex-col md:flex-row items-center w-full max-w-5xl pointer-events-auto overflow-hidden rounded-[2.5rem] border-4 border-white/20 shadow-2xl p-0"
                    >
                      {/* Close button */}
                      <button
                        onClick={() => setExpandedProjectId(null)}
                        className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full p-3 text-white shadow-sm transition-all hover:scale-110 active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>

                      <div className="absolute inset-0 z-0 bg-[#1a0a05]">
                        <img src={activeProject.bg_src} className="w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#1a0a05] via-[#1a0a05]/90 to-transparent"></div>
                      </div>

                      <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
                        <motion.img
                          layoutId={`project-icon-${activeProject.id}`}
                          src={activeProject.icon}
                          alt={activeProject.title}
                          className={`object-contain drop-shadow-2xl max-w-full ${activeProject.title === "Digital Heroes" ? "w-64 h-64 md:w-[400px] md:h-[400px] scale-125" : activeProject.title === "MyVanilla" ? "w-56 h-56 md:w-80 md:h-80" : "w-48 h-48 md:w-80 md:h-80"}`}
                        />
                      </div>

                      <div className="relative z-10 w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-start text-left">
                        {activeProject.title !== "Digital Heroes" && activeProject.title !== "MyVanilla" && (
                          <motion.h3 layoutId={`project-title-${activeProject.id}`} className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-white">
                            {activeProject.title}
                          </motion.h3>
                        )}

                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ delay: 0.1, duration: 0.2 }}
                          className="text-lg font-medium tracking-tight text-white/80 mb-10 leading-relaxed max-w-md drop-shadow-md"
                        >
                          {activeProject.description || "Un progetto ufficiale curato da Abbo APS volto a innovare e supportare la community digitale."}
                        </motion.p>

                        <motion.a
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ delay: 0.2, duration: 0.2 }}
                          href={activeProject.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="clay-btn px-8 py-4 font-bold tracking-widest uppercase inline-block whitespace-nowrap !bg-white !text-[#4a1c0d] hover:!bg-[#fffcf5] transition-all hover:scale-105 active:scale-95"
                        >
                          {activeProject.cta || "Scopri di più"}
                        </motion.a>
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* I Nostri Partner (moved outside max-w-7xl to prevent horizontal overflow constraint breaking) */}
        <div ref={partnerRef} className="w-full flex flex-col items-center mb-16 pt-12 overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-10 text-center text-[#4a1c0d]">
            I Nostri Partner
          </h2>

          {homeConfig.partners.length > 3 ? (
            /* Continuous Marquee Carousel */
            <div className="w-full overflow-hidden flex items-center bg-transparent py-6 relative group">
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fffcf5] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#fffcf5] to-transparent z-10 pointer-events-none"></div>

              <div className="flex w-max animate-marquee-infinite">
                {/* First Track */}
                <div className="flex items-center whitespace-nowrap gap-24 px-12">
                  {Array(Math.ceil(40 / Math.max(1, homeConfig.partners.length)))
                    .fill(homeConfig.partners)
                    .flat()
                    .map((partner, i) => (
                      <div
                        key={`partner-t1-${i}`}
                        className="flex-shrink-0 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300 w-40"
                      >
                        <img
                          src={partner.logo}
                          alt="Partner"
                          width="160"
                          height="64"
                          className="max-h-16 object-contain drop-shadow-md grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    ))}
                </div>
                {/* Second Track for seamless loop */}
                <div className="flex items-center whitespace-nowrap gap-24 px-12">
                  {Array(Math.ceil(40 / Math.max(1, homeConfig.partners.length)))
                    .fill(homeConfig.partners)
                    .flat()
                    .map((partner, i) => (
                      <div
                        key={`partner-t2-${i}`}
                        className="flex-shrink-0 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300 w-40"
                      >
                        <img
                          src={partner.logo}
                          alt="Partner"
                          width="160"
                          height="64"
                          className="max-h-16 object-contain drop-shadow-md grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 py-8 px-6 w-full max-w-4xl mx-auto">
              {homeConfig.partners.map((partner, i) => (
                <div key={`partner-${i}`} className="flex items-center justify-center opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 w-48 md:w-64">
                  <img
                    src={partner.logo}
                    alt="Partner"
                    width="256"
                    height="128"
                    className="max-h-24 md:max-h-32 w-auto object-contain drop-shadow-xl grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full max-w-7xl flex flex-col items-center px-6">
          {/* Notizie Section - Asymmetric Grid */}
          <div className="w-full flex flex-col items-center pb-12">
            <div className="w-full flex flex-row items-center justify-between mb-12 max-w-7xl">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-[#4a1c0d]">
                Notizie
              </h2>
              <Link
                to="/notizie"
                className="clay-btn px-6 py-3 text-sm md:px-8 md:py-4 font-bold tracking-widest uppercase inline-block hover:scale-105 active:scale-95"
              >
                Scopri di più
              </Link>
            </div>

            <div className={`grid grid-cols-1 gap-8 w-full mb-12 max-w-7xl ${recentNews.length === 1 ? "max-w-3xl mx-auto" : recentNews.length === 2 ? "md:grid-cols-2 max-w-5xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
              {recentNews.map((item, idx) => {
                return (
                  <Link to={`/news/${item.id}`} key={item.id} className={`clay-card p-0 group relative flex flex-col min-h-[450px] overflow-hidden ${recentNews.length > 2 && idx === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}>
                    <div className="w-full h-56 md:h-64 relative shrink-0 overflow-hidden">
                      <img src={item.immagine} alt={item.titolo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col justify-start p-8 md:p-10 bg-white/40 backdrop-blur-md">
                      <span className="text-[#8a3a19] text-xs font-bold uppercase tracking-widest mb-4 inline-block">{item.data}</span>
                      <h2 className={`${recentNews.length > 2 && idx === 0 ? "text-4xl" : "text-3xl"} font-extrabold text-[#e65100] mb-4 line-clamp-2 leading-tight group-hover:text-[#ff8f00] transition-colors`}>
                        {item.titolo}
                      </h2>
                      <div className="relative z-10 w-full overflow-hidden line-clamp-3 text-[#4a1c0d]/80 font-medium leading-relaxed">
                        {item.estratto}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>          {/* Sezione 5 per Mille */}
          <div className="w-full flex flex-col items-center pt-8 pb-16 max-w-5xl mx-auto relative z-20">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="clay-card w-full p-12 md:p-20 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff8f00]/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e65100]/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="w-16 h-16 bg-[#e65100]/10 text-[#e65100] rounded-full flex items-center justify-center mb-8 hover:scale-110 transition-transform duration-300">
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
                  <span className="font-mono text-xl md:text-2xl font-black text-[#e65100] tracking-wider select-all">#########</span>
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
      </div>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ width: "100vw", height: "100vh" }}
      />
    </>
  );
}

