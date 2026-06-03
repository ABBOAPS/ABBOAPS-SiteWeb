import teamConfig from "../config/team.json";
import { Mail, Phone, Instagram, Github, Linkedin, ArrowRight, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SEO } from "../components/SEO";
import { motion } from "motion/react";

export function Team() {
  const navigate = useNavigate();

  const handleProjectsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("projects");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="relative z-20 w-full min-h-screen pt-40 pb-0 bg-[#fffaf0]">
      <SEO title={teamConfig.title} url="/team" />
      
      {/* Hero Intro */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-6 md:px-24 mb-24 max-w-7xl mx-auto flex flex-col items-start"
      >
        <div className="w-16 h-1.5 bg-[#e65100] mb-8 rounded-full"></div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 text-[#4a1c0d] max-w-4xl leading-tight">
          {teamConfig.title}
        </h1>
        <p className="text-lg md:text-2xl font-medium tracking-tight leading-relaxed max-w-4xl text-[#8a3a19]">
          {teamConfig.description}
        </p>
      </motion.section>

      {/* Team Members List - Centered Flex (No vacant grid spots) */}
      <section className="px-6 md:px-24 mb-32 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8 lg:gap-10 w-full">
          {teamConfig.members.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group flex flex-col items-center clay-member-card p-8 relative overflow-hidden w-full max-w-sm"
            >
              {/* Soft interior highlight */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#e65100]/5 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 pointer-events-none"></div>
              
              {/* Clean Rounded Image (No keychain shadows/borders) */}
              <div className="relative w-44 h-44 shrink-0 rounded-3xl overflow-hidden bg-transparent mb-6 shadow-sm">
                <img 
                  src={member.photo} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[1.2s] ease-out" 
                />
              </div>

              {/* Member Details */}
              <div className="flex-1 flex flex-col items-center text-center w-full">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8a3a19] opacity-75 mb-2 block">
                  {member.role}
                </span>
                <h3 className="font-extrabold text-2xl text-[#4a1c0d] group-hover:text-[#e65100] transition-colors mb-4">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-[#8a3a19]/90 leading-relaxed mb-6 flex-1">
                  {member.bio}
                </p>

                {/* Contacts & Socials Footer inside the card */}
                <div className="w-full mt-auto pt-5 border-t border-[#4a1c0d]/10 flex flex-col items-center gap-4">
                  {/* Email / Phone info */}
                  <div className="flex flex-col items-center gap-1.5 text-xs font-semibold text-[#4a1c0d]/80">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 hover:text-[#e65100] transition-colors">
                        <Mail className="w-3.5 h-3.5 text-[#e65100]" />
                        {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 hover:text-[#e65100] transition-colors">
                        <Phone className="w-3.5 h-3.5 text-[#e65100]" />
                        {member.phone}
                      </a>
                    )}
                  </div>

                  {/* Social Icons */}
                  {member.socials && Object.keys(member.socials).length > 0 && (
                    <div className="flex justify-center gap-3">
                      {member.socials.instagram && (
                        <a 
                          href={member.socials.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-9 h-9 rounded-full bg-[#fffcf5] border border-[#e65100]/20 flex items-center justify-center text-[#4a1c0d]/60 hover:text-[#e65100] hover:bg-[#e65100]/10 hover:scale-110 transition-all shadow-sm"
                          aria-label="Instagram"
                        >
                          <Instagram className="w-4.5 h-4.5" />
                        </a>
                      )}
                      {member.socials.github && (
                        <a 
                          href={member.socials.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-9 h-9 rounded-full bg-[#fffcf5] border border-[#e65100]/20 flex items-center justify-center text-[#4a1c0d]/60 hover:text-[#e65100] hover:bg-[#e65100]/10 hover:scale-110 transition-all shadow-sm"
                          aria-label="GitHub"
                        >
                          <Github className="w-4.5 h-4.5" />
                        </a>
                      )}
                      {member.socials.linkedin && (
                        <a 
                          href={member.socials.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-9 h-9 rounded-full bg-[#fffcf5] border border-[#e65100]/20 flex items-center justify-center text-[#4a1c0d]/60 hover:text-[#e65100] hover:bg-[#e65100]/10 hover:scale-110 transition-all shadow-sm"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4.5 h-4.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Large Bottom CTA Banner Section */}
      <section className="px-6 md:px-24 mb-32 max-w-7xl mx-auto">
        <div className="group relative clay-card-dark transition-all duration-500 hover:-translate-y-1 overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch relative">
            <div className="absolute inset-0 z-0 bg-[#4a1c0d]"></div>
            
            <div className="md:w-1/2 lg:w-3/5 p-8 md:p-12 lg:p-16 relative z-10 flex flex-col justify-center">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight group-hover:text-[#e65100] transition-colors duration-500">
                Il team non finisce qui.
              </h2>
              <p className="text-base md:text-lg font-medium text-[#fffaf0]/80 mb-10 leading-relaxed max-w-xl group-hover:text-white transition-colors duration-500">
                Dietro a ogni nostro progetto c'è un gruppo dedicato di persone che lavora per realizzarlo. Oppure, se vuoi mettere le mani in pasta anche tu, entra a far parte della nostra squadra!
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/#projects"
                  onClick={handleProjectsClick}
                  className="clay-btn inline-flex items-center justify-center gap-3 font-bold px-8 py-5 tracking-wide hover:scale-105 transition-all text-white uppercase text-sm"
                >
                  <Briefcase className="w-5 h-5" />
                  Scopri i Progetti
                </a>
                
                <Link 
                  to="/contatti"
                  className="clay-btn inline-flex items-center justify-center gap-3 font-bold px-8 py-5 tracking-wide hover:scale-105 transition-all uppercase text-sm !bg-[#fffcf5] !text-[#4a1c0d] hover:!bg-[#fff0e0]"
                >
                  Unisciti a Noi
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Banner Illustration */}
            <div className="md:w-1/2 lg:w-2/5 min-h-[300px] w-full relative overflow-hidden">
               {/* Gradient overlay for blending */}
               <div className="absolute inset-0 bg-gradient-to-r from-[#4a1c0d] via-[#4a1c0d]/80 to-transparent z-10 md:block hidden"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#4a1c0d] via-[#4a1c0d]/80 to-transparent z-10 md:hidden block"></div>
               
               <img 
                 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" 
                 alt="Collaborazione Team"
                 className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0 origin-right" 
               />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
