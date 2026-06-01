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
      className="clay-card cursor-pointer relative aspect-[4/3] md:aspect-auto min-h-[400px] md:min-h-[480px] flex flex-col items-center justify-center group overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-[#fffcf5]">
        <img src={project.bg_src} className="w-full h-full object-cover group-hover:scale-110 group-hover:saturate-150 transition-all duration-1000 ease-out" />
        <div className="absolute inset-0 bg-[#fffcf5]/20 backdrop-blur-sm group-hover:backdrop-blur-none transition-all duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#fffcf5] via-transparent to-transparent opacity-80 group-hover:opacity-20 transition-opacity duration-500"></div>

        {/* Spotlight Effect overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 252, 245, 0.4),
                transparent 60%
              )
            `,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center p-6 w-full h-full gap-2 pointer-events-none">
        <motion.img
          layoutId={`project-icon-${project.id}`}
          src={project.icon}
          alt={project.title}
          className={`object-contain drop-shadow-xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 max-w-[90%] ${project.title === "Digital Heroes" ? "w-48 h-48 md:w-72 md:h-72 scale-125" : project.title === "MyVanilla" ? "w-40 h-40 md:w-64 md:h-64" : "w-28 h-28 md:w-40 md:h-40"}`}
        />
        {project.title !== "Digital Heroes" && project.title !== "MyVanilla" && (
          <motion.h3 layoutId={`project-title-${project.id}`} className="text-2xl md:text-3xl font-extrabold tracking-tighter text-[#e65100] drop-shadow-sm group-hover:scale-105 transition-all duration-500 text-center">
            {project.title}
          </motion.h3>
        )}
      </div>
    </motion.div>
  );
}

export function Home() {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const partnerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const jsonLd = generateNgoSchema();

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
          <img src={homeConfig.hero_background || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564"} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-md"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#ff8f00]/10 via-[#fffcf5]/40 to-[#fffaf0]"></div>
        </div>
        <div className="flex flex-col items-center pt-24 relative z-10">
          <motion.img
            src={homeConfig.association_logo}
            alt="ABBO APS Logo"
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
            <p className="text-lg md:text-xl mt-4 text-[#4a1c0d]/80 text-center max-w-2xl px-6" aria-label="Sottotitolo manifesto">
              ABBO APS
            </p>
          </motion.div>

          <motion.button
            onClick={handleScrollDown}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full relative">
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
                      className="clay-card relative flex flex-col md:flex-row items-center w-full max-w-5xl pointer-events-auto overflow-hidden"
                    >
                      {/* Close button */}
                      <button
                        onClick={() => setExpandedProjectId(null)}
                        className="absolute top-8 right-8 z-50 bg-white/50 hover:bg-white backdrop-blur-md rounded-full p-2 text-[#4a1c0d] shadow-sm transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>

                      <div className="absolute inset-0 z-0 bg-[#fffcf5]">
                        <img src={activeProject.bg_src} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-[#fffcf5]/20 backdrop-blur-sm"></div>
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#fffcf5] via-[#fffcf5]/80 to-transparent opacity-95"></div>
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
                          <motion.h3 layoutId={`project-title-${activeProject.id}`} className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-[#e65100]">
                            {activeProject.title}
                          </motion.h3>
                        )}

                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ delay: 0.1, duration: 0.2 }}
                          className="text-lg font-medium tracking-tight text-[#4a1c0d]/80 mb-10 leading-relaxed max-w-md"
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
                          className="clay-btn px-8 py-4 font-bold tracking-widest uppercase inline-block whitespace-nowrap"
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

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#4a1c0d]/20 to-transparent my-16"></div>
        </div>

        {/* I Nostri Partner (moved outside max-w-7xl to prevent horizontal overflow constraint breaking) */}
        <div ref={partnerRef} className="w-full flex flex-col items-center mb-16 pt-12 overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-10 text-center text-[#4a1c0d]">
            I Nostri Partner
          </h2>

          {/* Continuous Marquee Carousel */}
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
                        className="max-h-16 object-contain drop-shadow-md grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl flex flex-col items-center px-6">
          {/* Notizie Section - Asymmetric Grid */}
          <div className="w-full flex flex-col items-center pb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-12 text-center text-[#4a1c0d]">
              Notizie
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
              {recentNews.map((item, idx) => {
                return (
                  <Link to={`/news/${item.id}`} key={item.id} className={`clay-card group relative flex flex-col min-h-[400px] overflow-hidden ${idx === 0 ? "lg:col-span-2" : ""}`}>
                    <div className="w-full h-48 md:h-56 relative shrink-0">
                      <img src={item.immagine} alt={item.titolo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col justify-end p-6 md:p-8">
                      <span className="text-[#8a3a19] text-xs font-bold uppercase tracking-widest mb-3 clay-badge px-3 py-1.5 self-start">{item.data}</span>
                      <h2 className={`${idx === 0 ? "text-4xl" : "text-3xl"} font-extrabold text-[#e65100] mb-4 line-clamp-2 leading-tight group-hover:text-[#ff8f00] transition-colors`}>
                        {item.titolo}
                      </h2>
                      <div className="relative z-10 w-full overflow-hidden line-clamp-3 text-[#4a1c0d] font-medium leading-relaxed">
                        {item.estratto}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              to="/notizie"
              className="clay-btn px-8 py-4 font-bold tracking-widest uppercase inline-block"
            >
              Scopri di più
            </Link>
          </div>

          {/* Call to Action Support - Removed */}
        </div>
      </div>
    </>
  );
}

