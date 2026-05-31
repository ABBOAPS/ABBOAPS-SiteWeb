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
        <div className="w-full max-w-4xl clay-card p-10 md:p-20">
          <div className="markdown-body">
            <Markdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-[#e65100] tracking-tighter" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-[#4a1c0d] tracking-tight" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-[#4a1c0d]" {...props} />,
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
    );
}
