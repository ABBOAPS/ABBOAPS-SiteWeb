import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { dataNews } from "../data/newsData";
import { generateBlogSchema } from "../utils/seo-microdata";

export function Notizie() {
  const [searchQuery, setSearchQuery] = useState("");

  const newsItems = useMemo(() => {
    return [...dataNews].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, []);

  const filteredNews = newsItems.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return item.titolo.toLowerCase().includes(searchLower) || 
           item.contenuto.toLowerCase().includes(searchLower) ||
           item.tags.some(t => t.toLowerCase().includes(searchLower)) ||
           item.estratto.toLowerCase().includes(searchLower);
  });

  const schema = generateBlogSchema();

  return (
    <main className="relative z-20 w-full min-h-screen pt-40 px-6 md:px-24 flex flex-col pb-48 text-[#4a1c0d]">
      <SEO 
        title="Notizie | ABBO APS" 
        description="Rimani aggiornato con le ultime notizie, gli spazi di riflessione e le informazioni sui progetti sociali e per i giovani di Abbo APS."
        url="/notizie" 
      >
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </SEO>
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-10 text-center">
          Notizie
        </h1>
        
        <div className="w-full max-w-2xl mb-16 relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4a1c0d]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Cerca articoli, annunci o tag..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 clay-input text-xl font-medium tracking-tight text-[#4a1c0d] transition-all"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {filteredNews.map((item, idx) => (
            <Link key={item.id} to={`/news/${item.id}`} className={`clay-card group relative flex flex-col min-h-[450px] overflow-hidden ${idx === 0 ? "lg:col-span-2" : ""}`}>
              <div className="w-full h-48 md:h-64 relative shrink-0">
                <img src={item.immagine} alt={item.titolo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
              </div>
              <div className="relative z-10 flex-1 flex flex-col justify-end p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[#8a3a19] text-xs font-bold uppercase tracking-widest clay-badge px-3 py-1.5">{item.data}</span>
                  {item.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className="clay-btn text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className={`${idx === 0 ? "text-4xl" : "text-3xl"} font-extrabold text-[#e65100] mb-4 line-clamp-2 leading-tight group-hover:text-[#ff8f00] transition-colors`}>
                  {item.titolo}
                </h2>
                <div className="relative z-10 line-clamp-3">
                  <p className="text-[#4a1c0d] font-medium leading-relaxed">{item.estratto}</p>
                </div>
              </div>
            </Link>
          ))}
          {filteredNews.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-20 text-center">
              <span className="text-[#4a1c0d]/40 text-xl font-medium tracking-tight mb-4">Nessun articolo trovato per "{searchQuery}"</span>
              <button 
                onClick={() => setSearchQuery("")}
                className="text-[#e65100] font-bold uppercase tracking-widest text-sm hover:text-[#ff8f00] transition-colors"
              >
                Resetta Ricerca
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
