import chiSiamoConfig from "../config/chi_siamo.json";
import * as LucideIcons from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { motion } from "motion/react";

export function ChiSiamo() {
  return (
    <div className="relative z-20 w-full min-h-screen pt-40 pb-0 bg-[#fffaf0]">
      <SEO title="Chi Siamo" url="/chi-siamo" />
      
      {/* Hero Intro */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-6 md:px-24 mb-24 max-w-7xl mx-auto flex flex-col items-start"
      >
        <div className="w-16 h-1.5 bg-[#e65100] mb-8 rounded-full"></div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 text-[#4a1c0d] max-w-4xl leading-tight">
          {chiSiamoConfig.hero.title}
        </h1>
        <p className="text-lg md:text-2xl font-medium tracking-tight leading-relaxed max-w-4xl text-[#8a3a19]">
          {chiSiamoConfig.hero.description}
        </p>
      </motion.section>

      {/* Mission Box (La Terra Sopra cui Camminiamo) */}
      <section className="px-6 md:px-24 mb-32 max-w-7xl mx-auto">
        <div className="group relative clay-card p-10 md:p-16 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(230,81,0,0.1)] hover:-translate-y-1">
          {/* Subtle pattern background on hover */}
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ backgroundImage: `radial-gradient(#e65100 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px', opacity: 0.03 }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12 lg:gap-20 items-start">
            <div className="md:w-1/3 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e65100]/10 text-[#e65100] font-bold text-xs uppercase tracking-widest mb-6">
                <LucideIcons.MapPin className="w-4 h-4" />
                Missione
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#4a1c0d] leading-tight group-hover:text-[#e65100] transition-colors duration-300">
                {chiSiamoConfig.mission_box.title}
              </h2>
            </div>
            <div className="md:w-2/3">
              <p className="text-lg md:text-xl font-medium text-[#8a3a19] leading-relaxed group-hover:text-[#4a1c0d] transition-colors duration-300">
                {chiSiamoConfig.mission_box.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Quotes */}
      <section className="px-6 md:px-24 mb-32 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
          <div className="h-px bg-[#e65100]/20 flex-1"></div>
          <span className="text-[#e65100] font-bold text-sm uppercase tracking-widest px-4">Le Voci fondatrici</span>
          <div className="h-px bg-[#e65100]/20 flex-1"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {chiSiamoConfig.founders_quotes.map((quote, idx) => (
            <div key={idx} className="group flex flex-col justify-between clay-card p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-[#e65100]/10 hover:-translate-y-2 relative overflow-hidden">
              <LucideIcons.Quote className="absolute -top-6 -right-6 w-32 h-32 text-[#e65100] opacity-5 rotate-12 group-hover:rotate-0 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700 pointer-events-none" />
              
              <p className="text-xl font-medium text-[#4a1c0d]/80 leading-relaxed mb-12 relative z-10 italic group-hover:text-[#4a1c0d] transition-colors duration-300">
                {quote.quote}
              </p>
              
              <div className="flex items-center gap-5 mt-auto relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#e65100] rounded-full scale-110 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <img src={quote.author.photo} alt={quote.author.name} className="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-[#e65100]/50 transition-all duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl text-[#4a1c0d] group-hover:text-[#e65100] transition-colors">{quote.author.name}</span>
                  <span className="text-sm font-bold uppercase tracking-wider text-[#8a3a19] opacity-70">{quote.author.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* I Nostri Valori */}
      <section className="px-6 md:px-24 mb-40 max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#4a1c0d] mb-4">I Nostri Valori</h2>
            <p className="text-xl text-[#8a3a19] font-medium leading-relaxed">I principi che guidano le nostre azioni e le nostre scelte ogni giorno, alla ricerca di un impatto duraturo.</p>
          </div>
          <div className="hidden md:block w-32 h-1 bg-[#e65100]/20 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chiSiamoConfig.values.map((val, idx) => {
            const Icon = (LucideIcons as any)[val.icon] || LucideIcons.Heart;
            return (
              <div key={idx} className="group clay-card p-10 lg:p-12 flex flex-col transition-all duration-500 hover:bg-[#fffcf5] hover:shadow-[0_20px_50px_rgba(230,81,0,0.15)] hover:-translate-y-3 relative overflow-hidden">
                
                {/* Animated corner ambient blur */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#e65100] opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-700 pointer-events-none"></div>

                <div className="w-16 h-16 rounded-2xl bg-[#fffcf5] border border-[#e65100]/20 flex items-center justify-center mb-10 group-hover:bg-[#e65100] group-hover:border-transparent group-hover:shadow-[0_10px_20px_rgba(230,81,0,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                  <Icon className="w-7 h-7 stroke-[2.5] text-[#e65100] group-hover:text-white transition-colors duration-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-[#4a1c0d] mb-4 group-hover:text-[#e65100] transition-colors">{val.title}</h3>
                
                <p className="text-base font-medium text-[#8a3a19] leading-relaxed group-hover:text-[#4a1c0d] transition-colors">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 md:px-24 mb-32 max-w-7xl mx-auto">
        <div className="group relative clay-card-dark transition-all duration-500 hover:-translate-y-1 overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch relative">
            <div className="absolute inset-0 z-0 bg-[#4a1c0d]"></div>
            <div className="md:w-1/2 lg:w-3/5 p-8 md:p-12 relative z-10 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight group-hover:text-[#e65100] transition-colors duration-500">
                {chiSiamoConfig.cta_banner.title}
              </h2>
              <p className="text-lg font-medium text-[#fffaf0]/80 mb-10 leading-relaxed max-w-lg group-hover:text-white transition-colors duration-500">
                {chiSiamoConfig.cta_banner.subtitle}
              </p>
              <div className="flex">
                <Link 
                  to={chiSiamoConfig.cta_banner.button_link}
                  className="clay-btn inline-flex items-center justify-center gap-3 font-bold px-8 py-5 tracking-wide hover:scale-105 transition-all text-white uppercase text-sm"
                >
                  {chiSiamoConfig.cta_banner.button_text}
                  <LucideIcons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 lg:w-2/5 min-h-[300px] w-full relative overflow-hidden">
               {/* Gradient overlay for blending */}
               <div className="absolute inset-0 bg-gradient-to-r from-[#4a1c0d] via-[#4a1c0d]/80 to-transparent z-10 md:block hidden"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#4a1c0d] via-[#4a1c0d]/80 to-transparent z-10 md:hidden block"></div>
               
               <img src={chiSiamoConfig.cta_banner.illustration} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0 origin-right" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

