import { useMemo } from "react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, ArrowUp } from "lucide-react";
import { SEO } from "./SEO";

interface TesseraMarkdownViewerProps {
  content: string;
  title: string;
  seoDescription: string;
  urlPath: string;
  footerLinks?: { label: string; to: string }[];
}

export function TesseraMarkdownViewer({
  content,
  title,
  seoDescription,
  urlPath,
  footerLinks = [],
}: TesseraMarkdownViewerProps) {

  const slugify = (text: any): string => {
    if (!text) return "";
    const str = Array.isArray(text) ? text.join("") : text.toString();
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Generatore automatico dell'indice / sommario dai titoli ## (h2) e ### (h3)
  const toc = useMemo(() => {
    if (!content) return [];
    const matches = [...content.matchAll(/^(##|###)\s+(.*)$/gm)];
    return matches.map((m) => {
      const rawText = m[2].trim();
      // Rimuovi formattazione bold/backtick dal testo dell'indice
      const cleanText = rawText.replace(/[*`_]/g, "");
      return {
        level: m[1] === "##" ? 2 : 3,
        text: cleanText,
        id: slugify(cleanText),
      };
    });
  }, [content]);

  return (
    <div className="min-h-screen w-full bg-[#fffcf5] text-[#4a1c0d] px-4 py-8 sm:py-12 flex flex-col items-center">
      <SEO title={`${title} | ABBO APS`} description={seoDescription} url={urlPath} />

      <div className="w-full max-w-3xl flex flex-col gap-6">
        
        {/* Pulsante Torna alla Verifica */}
        <Link
          to="/tessera"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#e65100] hover:text-[#8a3a19] transition-colors focus:outline-none focus:ring-2 focus:ring-[#e65100] rounded-lg self-start min-h-[44px] px-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Torna alla verifica tessera</span>
        </Link>

        {/* Indice / Sommario Generato Automaticamente in Alto */}
        {toc.length > 0 && (
          <nav aria-label="Sommario del documento" className="p-5 rounded-2xl bg-[#4a1c0d]/5 border border-[#4a1c0d]/15 text-xs sm:text-sm font-semibold shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[#e65100]" />
              <h2 className="font-extrabold uppercase text-[#e65100] tracking-wider text-xs sm:text-sm">
                Sommario ed Indice dei Contenuti
              </h2>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#4a1c0d]/90 font-medium">
              {toc.map((item, idx) => (
                <li key={idx} className={item.level === 3 ? "pl-4 text-xs" : ""}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(item.id);
                      if (element) {
                        const y = element.getBoundingClientRect().top + window.scrollY - 80;
                        window.scrollTo({ top: y, behavior: "smooth" });
                      }
                    }}
                    className="hover:text-[#e65100] hover:underline transition-colors block py-0.5"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Rendering del Documento Markdown in Basso */}
        <article className="prose prose-stone max-w-none text-sm sm:text-base leading-relaxed text-[#4a1c0d] font-medium space-y-4">
          <Markdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#4a1c0d] border-b border-[#4a1c0d]/15 pb-4 mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => {
                const id = slugify(children);
                return (
                  <h2
                    id={id}
                    className="text-lg sm:text-2xl font-extrabold text-[#4a1c0d] mt-8 mb-3 scroll-mt-20 flex items-center gap-2 border-b border-[#4a1c0d]/10 pb-2"
                  >
                    <span className="text-[#e65100] font-black">#</span>
                    <span>{children}</span>
                  </h2>
                );
              },
              h3: ({ children }) => {
                const id = slugify(children);
                return (
                  <h3
                    id={id}
                    className="text-base sm:text-lg font-bold text-[#4a1c0d] mt-5 mb-2 scroll-mt-20"
                  >
                    {children}
                  </h3>
                );
              },
              p: ({ children }) => <p className="leading-relaxed mb-3">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 pl-2 mb-4">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 pl-2 mb-4">{children}</ol>,
              blockquote: ({ children }) => (
                <blockquote className="p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 text-amber-950 text-xs sm:text-sm font-semibold my-4 leading-relaxed">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="px-2 py-0.5 rounded-md bg-[#4a1c0d]/10 text-[#e65100] font-mono text-xs sm:text-sm font-bold">
                  {children}
                </code>
              ),
            }}
          >
            {content}
          </Markdown>
        </article>

        {/* Pulsante Torna Su */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="self-center mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#4a1c0d]/60 hover:text-[#e65100] transition-colors py-2 px-4 rounded-full bg-[#4a1c0d]/5 hover:bg-[#e65100]/10"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Torna in alto</span>
        </button>

        {/* Footer Con Link Correlati */}
        <footer className="mt-8 pt-6 border-t border-[#4a1c0d]/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#4a1c0d]/70">
          <p>© 2026 ABBO APS — Tutti i diritti riservati</p>

          <div className="flex gap-4">
            {footerLinks.map((link, idx) => (
              <Link key={idx} to={link.to} className="hover:underline font-bold text-[#e65100]">
                {link.label}
              </Link>
            ))}
          </div>
        </footer>

      </div>
    </div>
  );
}
