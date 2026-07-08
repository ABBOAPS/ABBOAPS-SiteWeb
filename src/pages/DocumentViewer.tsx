import { useParams } from "react-router-dom";
import Markdown from "react-markdown";
import { useMemo } from "react";
import { SEO } from "../components/SEO";

const mdFiles = import.meta.glob("../content/docs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export function DocumentViewer() {
  const { id } = useParams();

  const content = useMemo(() => {
    // try to find matching file, e.g. "statuto"
    const fileKey = Object.keys(mdFiles).find(
      (path) =>
        path.includes(`${id}.md`) ||
        path.includes(`${id?.replace("-", "_")}.md`),
    );
    return fileKey ? mdFiles[fileKey] : null;
  }, [id]);

  const slugify = (text: any) => {
    if (!text) return '';
    return text.toString().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const toc = useMemo(() => {
    if (!content) return [];
    const matches = [...content.matchAll(/^(##|###)\s+(.*)$/gm)];
    return matches.map(m => ({
      level: m[1] === '##' ? 2 : 3,
      text: m[2],
      id: slugify(m[2])
    }));
  }, [content]);

  if (!content) {
    return (
      <div className="min-h-screen pt-40 px-8 flex justify-center text-[#4a1c0d]">
        <h1 className="text-4xl font-bold">Documento non trovato</h1>
      </div>
    );
  }

  const title = id ? id.replace(/-/g, " ").replace(/_/g, " ") : "Documento";

  return (
    <div className="relative z-20 w-full min-h-screen pt-40 px-4 md:px-24 pb-32 flex justify-center text-[#4a1c0d]">
      <SEO title={title.charAt(0).toUpperCase() + title.slice(1)} url={`/documenti/${id}`} />
      <div className="w-full max-w-4xl">
        
        {/* Table of Contents */}
        {toc.length > 0 && (
          <div className="clay-card p-8 mb-8 bg-white/50 backdrop-blur-md border border-[#e65100]/20">
            <h2 className="text-2xl font-extrabold mb-6 text-[#e65100]">Indice dei Contenuti</h2>
            <ul className="space-y-3">
              {toc.map((item, i) => (
                <li key={i} className={item.level === 3 ? "ml-6" : ""}>
                  <a 
                    href={`#${item.id}`} 
                    className="text-[#4a1c0d]/80 hover:text-[#e65100] font-medium transition-colors hover:underline text-sm md:text-base"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(item.id);
                      if (element) {
                        const y = element.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="clay-card p-10 md:p-20">
          <div className="markdown-body">
            <Markdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-[#e65100] tracking-tighter" {...props} />,
                h2: ({node, children, ...props}) => <h2 id={slugify(children as string)} className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-[#4a1c0d] tracking-tight scroll-mt-24" {...props}>{children}</h2>,
                h3: ({node, children, ...props}) => <h3 id={slugify(children as string)} className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-[#4a1c0d] scroll-mt-24" {...props}>{children}</h3>,
                p: ({node, ...props}) => <p className="text-lg leading-relaxed mb-6 text-[#4a1c0d]/80 font-medium" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 text-lg text-[#4a1c0d]/80 font-medium space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 text-lg text-[#4a1c0d]/80 font-medium space-y-2" {...props} />,
                li: ({node, ...props}) => <li {...props} />,
                a: ({node, ...props}) => <a className="text-[#e65100] underline font-bold hover:text-[#ff8f00]" {...props} />,
                strong: ({node, ...props}) => <strong className="font-extrabold text-[#4a1c0d]" {...props} />,
                em: ({node, ...props}) => <em className="italic" {...props} />,
                hr: ({node, ...props}) => <hr className="my-10 border-[#4a1c0d]/10" {...props} />
              }}
            >
              {content}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}
