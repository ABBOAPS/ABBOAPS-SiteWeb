import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const content = await readFile(resolve(root, "src/docs/content.ts"), "utf8");
const mode = process.argv[2] || "validate";
const errors = [];
const pageCount = (content.match(/make\("/g) || []).length;
const slugs = [...content.matchAll(/make\("([^\"]+)"/g)].map((match) => match[1]);

if (pageCount < 35) errors.push(`ABBO Docs richiede almeno 35 pagine: trovate ${pageCount}.`);
for (const required of ["impara", "usa", "capisci", "nfc/verifica-pubblica", "api/membership-card-verify"]) {
  if (!content.includes(required)) errors.push(`Manca la copertura richiesta: ${required}`);
}
if (new Set(slugs).size !== slugs.length) errors.push("Esistono slug duplicati.");

if (mode === "check-links") {
  const references = [...content.matchAll(/related: \[([^\]]*)\]/g)].flatMap((match) => [...match[1].matchAll(/"([^\"]+)"/g)].map((value) => value[1]));
  for (const slug of references) if (!slugs.includes(slug)) errors.push(`Link o relazione non risolta: ${slug}`);
}

if (mode === "public-safety" || mode === "check-pii") {
  const forbidden = [/service[_-]?role/i, /SUPABASE_SERVICE_ROLE/i, /RESEND_API_KEY/i, /PRIVATE KEY/i, /QR_SIGNING_KEY/i, /NFC_TOKEN_HMAC_KEY/i, /CARD_TOKEN_PEPPER/i, /localhost:\d+/i, /127\.0\.0\.1/i, /BEGIN [A-Z ]+PRIVATE KEY/i];
  for (const pattern of forbidden) if (pattern.test(content)) errors.push(`Pattern pubblico da revisionare: ${pattern}`);
  if (mode === "check-pii") for (const pattern of [/\b\d{3}\.\d{3}\.\d{3}\.\d{3}\b/, /\b[A-Z]{2,3}\d{5,16}\b/]) if (pattern.test(content)) errors.push(`Possibile PII/token nel contenuto: ${pattern}`);
}

if (errors.length) { console.error(errors.map((error) => `✗ ${error}`).join("\n")); process.exit(1); }
console.log(`✓ ABBO Docs ${mode}: ${pageCount} pagine, nessun problema rilevato.`);
