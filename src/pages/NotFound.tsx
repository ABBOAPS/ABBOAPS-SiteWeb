import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";
import { Compass, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="relative z-20 w-full min-h-screen pt-40 px-6 md:px-24 flex flex-col items-center justify-center pb-48 text-[#4a1c0d]">
      <SEO title="Pagina Non Trovata | 404" url="/404" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl flex flex-col items-center text-center clay-card p-12 md:p-24"
      >
        <div className="relative mb-8">
          <Compass className="w-24 h-24 text-[#e65100] animate-spin-slow" style={{ animationDuration: '10s' }} />
          <div className="absolute inset-0 bg-[#e65100]/20 blur-2xl rounded-full z-[-1] animate-pulse"></div>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 text-[#4a1c0d]">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#8a3a19]">
          Hai perso la bussola?
        </h2>
        
        <p className="text-lg md:text-xl font-medium text-[#4a1c0d]/70 max-w-lg mb-12">
          La pagina che stai cercando sembra non esistere. Forse è stata spostata, oppure non è mai stata qui.
        </p>

        <Link 
          to="/" 
          className="clay-btn inline-flex items-center gap-3 font-bold px-8 py-4 tracking-widest uppercase hover:-translate-y-1 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Torna alla Home
        </Link>
      </motion.div>
    </div>
  );
}
