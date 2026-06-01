import { SEO } from "../components/SEO";
import { Download, FileText, Image as ImageIcon, Camera, FolderOpen, ArrowRight, Video, Link as LinkIcon } from "lucide-react";
import config from "../config/documenti.json";

function getTypeStyles(type: string) {
  switch (type.toLowerCase()) {
    case 'pdf':
      return { icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" };
    case 'folder':
      return { icon: FolderOpen, color: "text-orange-500", bg: "bg-orange-500/10" };
    case 'video':
      return { icon: Video, color: "text-purple-500", bg: "bg-purple-500/10" };
    case 'image':
      return { icon: ImageIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    default:
      return { icon: LinkIcon, color: "text-gray-500", bg: "bg-gray-500/10" };
  }
}

export function Documenti() {
  const materials = config.sections.materials;
  const galleries = config.sections.galleries;

  return (
    <div className="relative z-20 w-full min-h-screen pt-40 px-6 md:px-24 pb-32 bg-[#fffcf5] text-[#4a1c0d]">
      <SEO title={config.title} url="/documenti" />
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header section */}
        <div className="w-16 h-1.5 bg-[#e65100] mb-8 rounded-full"></div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-[#4a1c0d] text-center">
          {config.title}
        </h1>
        <p className="text-lg md:text-xl font-medium tracking-tight leading-relaxed max-w-2xl text-[#8a3a19] text-center mb-24">
          {config.subtitle}
        </p>

        {/* Brand Book & Downloads */}
        <div className="w-full flex flex-col md:flex-row items-end justify-between gap-6 mb-12 border-b border-[#e65100]/20 pb-6">
          <div>
            <h2 className="text-3xl font-extrabold flex items-center gap-4 text-[#4a1c0d]">
              <Download className="w-8 h-8 text-[#e65100]" /> {materials.title}
            </h2>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {materials.items.map((mat, idx) => {
            const { icon: Icon, color, bg } = getTypeStyles(mat.type);
            return (
              <a key={idx} href={mat.link} target="_blank" rel="noopener noreferrer" className="clay-card p-8 flex flex-col justify-between group cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 self-start aspect-square shrink-0 ${bg}`}>
                  <Icon className={`w-6 h-6 stroke-[2] ${color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-[#4a1c0d] group-hover:text-[#e65100] transition-colors">{mat.title}</h3>
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#8a3a19]/70">{mat.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#e65100] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Galleries */}
        <div className="w-full flex flex-col md:flex-row items-end justify-between gap-6 mb-12 border-b border-[#e65100]/20 pb-6">
          <div>
            <h2 className="text-3xl font-extrabold flex items-center gap-4 text-[#4a1c0d]">
              <Camera className="w-8 h-8 text-[#e65100]" /> {galleries.title}
            </h2>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleries.items.map((gal, idx) => (
            <a key={idx} href={gal.link} target="_blank" rel="noopener noreferrer" className="clay-card-dark group relative aspect-square block cursor-pointer overflow-hidden">
              <div className="absolute inset-0 z-0 bg-black">
                <img src={gal.coverImage} alt={gal.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              </div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 pointer-events-none">
                <div className="inline-flex items-center self-start gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest mb-4">
                  <FolderOpen className="w-3 h-3" />
                  {gal.item_count_label}
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight group-hover:text-[#ffb300] transition-colors duration-300">
                  {gal.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
