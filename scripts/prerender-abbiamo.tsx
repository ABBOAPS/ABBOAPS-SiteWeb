import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import { FestivalAbbiamoContent } from "../src/components/abbiamo/FestivalAbbiamoContent";
import { abbiamoData, buildAbbiamoEventSchema } from "../src/data/abbiamo";

const SITE_URL = "https://abboaps.org";

interface StaticNewsArticleData {
  id: string;
  titolo: string;
  estratto: string;
  contenuto: string;
  data: string;
  descrizione: string;
  immagine: string;
}

async function loadNews(): Promise<StaticNewsArticleData[]> {
  const files = (await readdir("src/content/news")).filter((file) => file.endsWith(".md"));
  return Promise.all(files.map(async (file) => {
    const raw = await readFile(`src/content/news/${file}`, "utf8");
    const frontmatterRegex = /---\n([\s\S]*?)\n---/;
    const match = raw.match(frontmatterRegex);
    const metadata: Record<string, string> = {};
    let content = raw;
    if (match) {
      match[1].split("\n").forEach((line) => {
        const [key, ...values] = line.split(":");
        if (key && values.length > 0) metadata[key.trim()] = values.join(":").trim().replace(/^['"]|['"]$/g, "");
      });
      content = raw.replace(frontmatterRegex, "").trim();
    }
    const paragraphs = content.split("\n\n").filter((paragraph) => paragraph.trim() && !paragraph.startsWith("#"));
    const estratto = paragraphs.length > 0
      ? `${paragraphs[0].replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/\[(.*?)\]\(.*?\)/g, "$1").substring(0, 150)}...`
      : "";
    return {
      id: file.replace(/\.md$/, ""),
      titolo: metadata.title || "Untitled",
      estratto,
      contenuto: content,
      data: metadata.date || "",
      descrizione: metadata.description || "",
      immagine: metadata.cover_image || "/logo_abbo_nero.svg",
    };
  }));
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function StaticNewsArticle({ article }: { article: (typeof dataNews)[number] }) {
  return (
    <main className="relative z-20 w-full min-h-screen pt-40 px-6 md:px-24 flex flex-col pb-48 text-[#4a1c0d]">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <article className="w-full flex flex-col clay-card p-6 md:p-12 mb-12">
          <div className="w-full h-80 md:h-[450px] rounded-[1.5rem] overflow-hidden shadow-inner mb-10 relative">
            <img src={article.immagine} alt={article.titolo} width="960" height="503" className="w-full h-full object-cover" />
          </div>
          <div className="mb-6">
            <time dateTime={article.data} className="text-violet-800 text-xs font-bold uppercase tracking-widest clay-badge px-4 py-2">
              {article.data}
            </time>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#e65100] tracking-tight leading-tight mt-6 mb-4">{article.titolo}</h1>
          </div>
          <div className="relative text-lg md:text-xl text-[#4a1c0d] font-normal tracking-wide leading-relaxed markdown-body">
            <Markdown>{article.contenuto}</Markdown>
          </div>
        </article>
      </div>
    </main>
  );
}

const rootIndex = await readFile("dist/index.html", "utf8");
const dataNews = await loadNews();
const content = renderToStaticMarkup(<FestivalAbbiamoContent />).replace(/<link rel="preload"[^>]*\/>/g, "");
const schema = JSON.stringify(buildAbbiamoEventSchema()).replace(/</g, "\\u003c");
const metadata = `
    <link rel="canonical" href="${abbiamoData.canonicalUrl}" />
    <meta property="og:title" content="${abbiamoData.title}" />
    <meta property="og:description" content="${abbiamoData.description}" />
    <meta property="og:url" content="${abbiamoData.canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${abbiamoData.ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${abbiamoData.title}" />
    <meta name="twitter:description" content="${abbiamoData.description}" />
    <meta name="twitter:image" content="${abbiamoData.ogImage}" />
    <script type="application/ld+json">${schema}</script>`;

const html = rootIndex
  .replace(/<title>.*?<\/title>/, `<title>${abbiamoData.title}</title>`)
  .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${abbiamoData.description}" />`)
  .replace(/<meta name="theme-color" content="[^"]*" \/>/, `<meta name="theme-color" content="${abbiamoData.colors.primary}" />`)
  .replace(/<link rel="icon" type="image\/svg\+xml" href="[^"]*" \/>/, `<link rel="icon" type="image/svg+xml" href="../abbiamo/favicon.svg" />`)
  .replace(/(href|src)="\.\//g, `$1="../`)
  .replace('<div id="root"></div>', `<div id="root">${content}</div>`)
  .replace("</head>", `${metadata}\n  </head>`);

await mkdir("dist/abbiamo", { recursive: true });
await writeFile("dist/abbiamo/index.html", html, "utf8");
console.log("Prerendered dist/abbiamo/index.html");

for (const article of dataNews) {
  const articleHtml = renderToStaticMarkup(<StaticNewsArticle article={article} />);
  const description = article.descrizione || article.estratto;
  const articleUrl = `${SITE_URL}/news/${article.id}/`;
  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${articleUrl}#article`,
    headline: article.titolo,
    description,
    image: [`${SITE_URL}${article.immagine}`],
    datePublished: article.data,
    dateModified: article.data,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  }).replace(/</g, "\\u003c");
  const articleMetadata = `
    <link rel="canonical" href="${articleUrl}" />
    <meta property="og:title" content="${escapeHtml(article.titolo)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="${SITE_URL}${article.immagine}" />
    <meta property="og:image:alt" content="${escapeHtml(article.titolo)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(article.titolo)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE_URL}${article.immagine}" />
    <script type="application/ld+json">${articleSchema}</script>`;
  const articleDocument = rootIndex
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(article.titolo)} | ABBO APS</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<meta name="theme-color" content="[^"]*" \/>/, `<meta name="theme-color" content="#e65100" />`)
    .replace(/<link rel="icon" type="image\/svg\+xml" href="[^"]*" \/>/, `<link rel="icon" type="image/svg+xml" href="../../favicon.svg" />`)
    .replace(/(href|src)="\.\//g, `$1="../../`)
    .replace('<div id="root"></div>', `<div id="root">${articleHtml}</div>`)
    .replace("</head>", `${articleMetadata}\n  </head>`);
  await mkdir(`dist/news/${article.id}`, { recursive: true });
  await writeFile(`dist/news/${article.id}/index.html`, articleDocument, "utf8");
  console.log(`Prerendered dist/news/${article.id}/index.html`);
}
