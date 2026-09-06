import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import Markdown from "react-markdown";
import { SEO } from "../components/SEO";
import { dataNews, Articolo } from "../data/newsData";
import { generateNewsArticleSchema } from "../utils/seo-microdata";
import siteConfig from "../config/site_config.json";

function formatItalianDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  } catch (e) {
    return dateStr;
  }
}

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const article: Articolo | null = dataNews.find((item) => item.id === id) ?? null;

  const schema = article ? generateNewsArticleSchema(
    article.titolo,
    article.descrizione || article.estratto,
    article.data,
    `${siteConfig.seo.url}${article.immagine}`,
    `https://abboaps.org/news/${article.id}/`
  ) : null;

  return (
    <main className="relative z-20 w-full min-h-screen pt-40 px-6 md:px-24 flex flex-col pb-48 text-[#4a1c0d]">
      <SEO 
        title={article ? `${article.titolo} | ABBO APS Notizie` : "Notizia | ABBO APS"} 
        description={article ? article.descrizione || article.estratto : undefined}
        image={article ? article.immagine : undefined}
        url={`/news/${id}`} 
      >
        {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
      </SEO>
      
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Elegant back button */}
        <div className="mb-8">
          <Link
            to="/notizie"
            className="clay-badge inline-flex items-center gap-2 px-6 py-3 transition-all text-violet-700 hover:text-violet-900 font-bold text-sm hover:-translate-y-0.5 transform duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Torna alle news
          </Link>
        </div>

        {!article ? (
          /* NotFound State */
          <div className="text-center py-20 clay-card p-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-rose-500 mx-auto mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-3xl font-bold text-violet-950 mb-3">Articolo non trovato</h2>
            <p className="text-violet-800/70 mb-8 max-w-md mx-auto">
              Siamo spiacenti, ma l'articolo richiesto non è presente nel nostro archivio.
            </p>
            <Link
              to="/notizie"
              className="clay-btn inline-flex items-center gap-2 px-6 py-3 font-bold transition-all"
            >
              Torna alle notizie
            </Link>
          </div>
        ) : (
          /* Static article view */
          <motion.article
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col clay-card p-6 md:p-12 mb-12"
          >
            {/* Big Cover Image */}
            {article.immagine && (
              <div className="w-full h-80 md:h-[450px] rounded-[1.5rem] overflow-hidden shadow-inner mb-10 relative">
                <img
                  src={article.immagine}
                  alt={article.titolo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fffcf5]/40 to-transparent pointer-events-none"></div>
              </div>
            )}

            {/* Header info */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-violet-800 text-xs font-bold uppercase tracking-widest clay-badge px-4 py-2">
                  <time dateTime={article.data}>{formatItalianDate(article.data)}</time>
                </span>
                {article.tags && article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="clay-btn text-[10px] font-bold uppercase tracking-widest px-4 py-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-[#e65100] tracking-tight leading-tight mb-4">
                {article.titolo}
              </h1>
            </div>

            {/* Styled divider */}
            <hr className="border-t border-[#e65100]/10 mb-8" />

            {/* Article Content with Markdown formatting */}
            <div className="relative text-lg md:text-xl text-[#4a1c0d] font-normal tracking-wide leading-relaxed markdown-body">
              <Markdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl mt-12 mb-6 font-extrabold text-[#e65100] tracking-tight" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl mt-10 mb-5 font-bold text-[#4a1c0d]" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl mt-8 mb-4 font-bold text-[#4a1c0d]" {...props} />,
                  p: ({node, ...props}) => <p className="mb-6 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-8 mb-6 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-8 mb-6 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="" {...props} />,
                  a: ({node, ...props}) => <a className="text-[#e65100] font-bold underline hover:text-[#ff8f00] transition-colors" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-extrabold text-[#4a1c0d]" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#e65100] pl-6 py-2 my-6 italic text-[#4a1c0d]/80 bg-[#e65100]/5 rounded-r-2xl" {...props} />,
                }}
              >
                {article.contenuto}
              </Markdown>
            </div>
          </motion.article>
        )}
      </div>
    </main>
  );
}
