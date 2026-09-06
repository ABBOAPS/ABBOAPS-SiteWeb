import { readFile } from "node:fs/promises";

const eventHtml = await readFile("dist/abbiamo/index.html", "utf8");
const festivalArticleHtml = await readFile("dist/news/festival_abbiamo_2026/index.html", "utf8");
const sitemap = await readFile("public/sitemap.xml", "utf8");

function requireMatch(source, pattern, message) {
  if (!pattern.test(source)) throw new Error(message);
}

const canonical = [...eventHtml.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((match) => match[1]);
if (canonical.length !== 1 || canonical[0] !== "https://abboaps.org/abbiamo/") {
  throw new Error(`Canonical ABBIAMO non valida: ${canonical.join(", ")}`);
}

requireMatch(eventHtml, /<title>Festival ABBIAMO a Verderio \| Fiera delle associazioni 2026<\/title>/, "Title ABBIAMO mancante o errato");
requireMatch(eventHtml, /<meta name="description" content="Festival ABBIAMO è la fiera delle associazioni/, "Meta description ABBIAMO mancante");
if (!eventHtml.includes('<script type="application/ld+json">') || !eventHtml.includes('"@type":"Event"') || !eventHtml.includes('"@id":"https://abboaps.org/abbiamo/#event"')) {
  throw new Error("Event JSON-LD mancante");
}
requireMatch(eventHtml, /Festival ABBIAMO — Fiera delle associazioni a Verderio/, "H1 semantico ABBIAMO mancante");
requireMatch(festivalArticleHtml, /href="\/abbiamo\/"/, "Link contestuale verso Festival mancante nell'articolo prerenderizzato");

if (sitemap.includes("#/abbiamo") || !sitemap.includes("https://abboaps.org/abbiamo/")) {
  throw new Error("Sitemap ABBIAMO non conforme");
}

for (const file of [
  "dist/abbiamo/index.html",
  "dist/news/festival_abbiamo_2026/index.html",
  "dist/news/annuncio_abbo_aps/index.html",
]) {
  await readFile(file);
}

console.log("SEO ABBIAMO verificato: canonical, metadata, Event JSON-LD, sitemap e prerender OK.");
