import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import { SEO } from "./SEO";

interface LegalMarkdownPageProps {
  title: string;
  description: string;
  url: string;
  content: string;
}

export function LegalMarkdownPage({ title, description, url, content }: LegalMarkdownPageProps) {
  return (
    <main className="relative z-20 w-full min-h-screen pt-40 px-6 md:px-24 flex flex-col pb-48 text-[#4a1c0d]">
      <SEO title={title} description={description} url={url} />
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <article className="w-full flex flex-col clay-card p-8 md:p-14 mb-12">
          <div className="relative text-lg md:text-xl text-[#4a1c0d] font-normal tracking-wide leading-relaxed markdown-body">
            <Markdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl md:text-5xl mt-6 mb-8 font-extrabold text-[#e65100] tracking-tight text-center" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl md:text-3xl mt-12 mb-5 font-bold text-[#4a1c0d]" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl md:text-2xl mt-8 mb-4 font-bold text-[#4a1c0d]" {...props} />,
                p: ({ node, ...props }) => <p className="mb-6 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-8 mb-6 space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-8 mb-6 space-y-2" {...props} />,
                li: ({ node, ...props }) => <li {...props} />,
                table: ({ node, ...props }) => <div className="overflow-x-auto mb-8"><table className="w-full border-collapse text-left text-base" {...props} /></div>,
                th: ({ node, ...props }) => <th className="border border-[#4a1c0d]/20 bg-[#e65100]/10 px-3 py-2 font-bold" {...props} />,
                td: ({ node, ...props }) => <td className="border border-[#4a1c0d]/20 px-3 py-2 align-top" {...props} />,
                a: ({ node, href, ...props }) => href?.startsWith("/")
                  ? <Link to={href} className="text-[#e65100] font-bold underline hover:text-[#ff8f00] transition-colors" {...props} />
                  : <a href={href} className="text-[#e65100] font-bold underline hover:text-[#ff8f00] transition-colors" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-extrabold text-[#4a1c0d]" {...props} />,
                hr: ({ node, ...props }) => <hr className="my-10 border-[#4a1c0d]/10" {...props} />,
              }}
            >
              {content}
            </Markdown>
          </div>
        </article>
      </div>
    </main>
  );
}
