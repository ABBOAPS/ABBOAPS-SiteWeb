import { mkdir, readFile, writeFile } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import { FestivalAbbiamoContent } from "../src/components/abbiamo/FestivalAbbiamoContent";
import { abbiamoData, buildAbbiamoEventSchema } from "../src/data/abbiamo";

const rootIndex = await readFile("dist/index.html", "utf8");
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
