import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, CircleHelp,
  Command, Copy, GitBranch, Layers3, Menu, Network, Search, ShieldCheck, Sparkles,
  Tag, X, Zap,
} from "lucide-react";
import { DocMode, DocPage, DocRole, docs, docBySlug, categoryOrder, modeLabels, statusLabels } from "./content";
import "./docs.css";

const roleLabels: Record<DocRole, string> = { socio: "Socio", segreteria: "Segreteria", amministratore: "Amministratore", presidente: "Presidente", sviluppatore: "Sviluppatore" };
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function StatusBadge({ status }: { status: DocPage["status"] }) {
  return <span className={`docs-status docs-status-${status}`}><span aria-hidden="true" />{statusLabels[status]}</span>;
}

function Breadcrumbs({ doc }: { doc?: DocPage }) {
  return <nav className="docs-breadcrumbs" aria-label="Percorso"><Link to="/docs">Docs</Link>{doc && <><ChevronRight size={14} aria-hidden="true" /><span>{doc.category}</span><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{doc.title}</span></>}</nav>;
}

function DocMarkdown({ body }: { body: string }) {
  return <div className="docs-markdown"><ReactMarkdown components={{
    h2: ({ children }) => { const text = String(children); return <h2 id={slugify(text)}>{children}<a className="docs-anchor" href={`#${slugify(text)}`} aria-label={`Collegamento a ${text}`}>#</a></h2>; },
    h3: ({ children }) => <h3>{children}</h3>,
    a: ({ href, children }) => href?.startsWith("/") ? <Link to={href}>{children}</Link> : <a href={href}>{children}</a>,
    code: ({ children, className }) => <code className={className}>{children}</code>,
  }}>{body}</ReactMarkdown></div>;
}

function CopyCode({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(children); setCopied(true); window.setTimeout(() => setCopied(false), 1600); } catch { setCopied(false); } };
  return <div className="docs-code-wrap"><pre><code>{children}</code></pre><button type="button" onClick={copy} className="docs-copy"><Copy size={14} />{copied ? "Copiato" : "Copia"}</button></div>;
}

function DocsMap() {
  const nodes = [
    { x: 50, y: 28, label: "ABBO APS", href: "/docs/inizia/ecosistema", tone: "root" },
    { x: 25, y: 58, label: "APP SOCI", href: "/docs/inizia/cose-app-soci", tone: "orange" },
    { x: 75, y: 58, label: "SITO PUBBLICO", href: "/docs/inizia/ecosistema", tone: "plum" },
    { x: 15, y: 88, label: "SOCI", href: "/docs/soci/profilo", tone: "cream" },
    { x: 35, y: 88, label: "ECONOMIA", href: "/docs/economia/panoramica", tone: "cream" },
    { x: 55, y: 88, label: "TESSERE", href: "/docs/nfc/cose", tone: "cream" },
    { x: 85, y: 88, label: "NFC VERIFY", href: "/docs/nfc/verifica-pubblica", tone: "cream" },
  ];
  return <section className="docs-feature docs-map" aria-labelledby="docs-map-title">
    <div className="docs-feature-heading"><div><span className="docs-kicker">Mappa interattiva</span><h2 id="docs-map-title">ABBO Docs Map</h2><p>Un ecosistema, quattro prospettive. Tocca un nodo per seguire il filo.</p></div><Network className="docs-feature-icon" aria-hidden="true" /></div>
    <div className="docs-map-canvas"><svg viewBox="0 0 100 100" role="img" aria-labelledby="map-title map-desc" preserveAspectRatio="none"><title id="map-title">Relazioni tra ABBO APS, APP SOCI, sito pubblico, economia e NFC</title><desc id="map-desc">ABBO APS si divide tra APP SOCI e sito pubblico. APP SOCI collega soci, economia e tessere; il sito collega la verifica NFC.</desc>{nodes.slice(1).map((node) => <line key={node.label} x1="50" y1="35" x2={node.x} y2={node.y - 8} className="docs-map-line" />)}</svg><div className="docs-map-nodes">{nodes.map((node) => <Link key={node.label} to={node.href} style={{ left: `${node.x}%`, top: `${node.y}%` }} className={`docs-map-node docs-map-node-${node.tone}`}><span>{node.label}</span><ChevronRight size={14} aria-hidden="true" /></Link>)}</div></div>
    <p className="docs-visually-hidden">Percorso equivalente: ABBO APS → APP SOCI → Soci, Economia e Tessere; ABBO APS → Sito pubblico → NFC Verify.</p>
  </section>;
}

function Tours() {
  const tours = [
    { title: "Primo giorno da socio", time: "5 min", steps: ["Installa", "Accedi", "Guarda la tessera", "Usa il QR"], href: "/docs/soci/installazione" },
    { title: "Prima ricevuta", time: "7 min", steps: ["Scegli il destinatario", "Completa i dati", "Controlla", "Consegna"], href: "/docs/staff/procedure-ricevute" },
    { title: "Prima tessera NFC", time: "10 min", steps: ["Assegna", "Programma", "Verifica", "Proteggi"], href: "/docs/nfc/ciclo-di-vita" },
    { title: "Chiusura annuale", time: "15 min", steps: ["Controlla ricevute", "Riconcilia", "Prepara report", "Archivia"], href: "/docs/economia/panoramica" },
  ];
  const [active, setActive] = useState(0);
  const tour = tours[active];
  return <section className="docs-feature docs-tours" aria-labelledby="tours-title"><div className="docs-feature-heading"><div><span className="docs-kicker">Percorsi guidati</span><h2 id="tours-title">Un passo alla volta.</h2><p>Checkpoint brevi, con un approfondimento quando serve.</p></div><GitBranch className="docs-feature-icon" aria-hidden="true" /></div><div className="docs-tour-tabs">{tours.map((item, index) => <button type="button" className={index === active ? "is-active" : ""} onClick={() => setActive(index)} key={item.title}>{item.title}<small>{item.time}</small></button>)}</div><div className="docs-tour-body"><div><span className="docs-tour-step">Percorso {active + 1} di {tours.length}</span><h3>{tour.title}</h3><div className="docs-tour-progress" aria-label={`${tour.steps.length} checkpoint`}>{tour.steps.map((step, index) => <span key={step} className={index === 0 ? "is-current" : ""}><b>{index + 1}</b>{step}</span>)}</div></div><Link className="docs-button docs-button-quiet" to={tour.href}>Inizia <ArrowRight size={16} /></Link></div></section>;
}

function NfcExplorer() {
  const [state, setState] = useState<"active" | "membership_inactive" | "not_valid">("active");
  const labels = { active: "Card valida", membership_inactive: "Quota non attiva", not_valid: "Card revocata" };
  const decisions = { active: "Verifica positiva", membership_inactive: "Card riconosciuta, quota non attiva", not_valid: "Risposta neutra" };
  return <section className="docs-feature docs-nfc-explorer" aria-labelledby="nfc-explorer-title"><div className="docs-feature-heading"><div><span className="docs-kicker">Simulazione didattica</span><h2 id="nfc-explorer-title">NFC Flow Explorer</h2><p>Un tap simulato, nessuna richiesta reale, nessun token.</p></div><Zap className="docs-feature-icon" aria-hidden="true" /></div><div className="docs-explorer-controls" role="group" aria-label="Scegli uno stato">{(Object.keys(labels) as Array<typeof state>).map((key) => <button type="button" className={state === key ? "is-active" : ""} onClick={() => setState(key)} key={key}>{labels[key]}</button>)}</div><div className="docs-flow"><span>Tap</span><i>→</i><span>URL pubblico</span><i>→</i><span>API v1</span><i>→</i><strong className={`docs-flow-result docs-flow-${state}`}>{decisions[state]}</strong></div><p className="docs-demo-note"><ShieldCheck size={15} /> Demo con dati fittizi. La documentazione non invia token all'API.</p></section>;
}

function TemplateMap() {
  const fields = [{ label: "Logo", key: "logo" }, { label: "Numero", key: "receipt.no" }, { label: "Data e luogo", key: "date / place" }, { label: "Destinatario", key: "recipient" }, { label: "Causale", key: "reason" }, { label: "Importo", key: "amount" }];
  const [selected, setSelected] = useState(fields[1]);
  return <section className="docs-feature docs-template-map" aria-labelledby="template-map-title"><div className="docs-feature-heading"><div><span className="docs-kicker">Laboratorio editoriale</span><h2 id="template-map-title">Template Map</h2><p>Un foglio fittizio per capire dove vivono i campi di una ricevuta.</p></div><Layers3 className="docs-feature-icon" aria-hidden="true" /></div><div className="docs-template-grid"><div className="docs-paper" aria-label="Anteprima fittizia di una ricevuta">{fields.map((field) => <button type="button" key={field.key} className={`docs-paper-field field-${field.key.replace(/[^a-z]/g, "-")} ${selected.key === field.key ? "is-selected" : ""}`} onClick={() => setSelected(field)}>{field.label}<small>[{field.key}]</small></button>)}</div><div className="docs-template-inspector"><span className="docs-kicker">Campo selezionato</span><h3>{selected.label}</h3><code>{`[${selected.key}]`}</code><dl><dt>Tipo</dt><dd>{selected.key === "amount" ? "Valuta" : "Testo"}</dd><dt>Comportamento</dt><dd>Overflow controllato</dd></dl></div></div></section>;
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState(""); const navigate = useNavigate();
  useEffect(() => { if (open) setQuery(""); }, [open]);
  if (!open) return null;
  const matches = docs.filter((doc) => `${doc.title} ${doc.description} ${doc.keywords.join(" ")}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
  return <div className="docs-command-backdrop" role="presentation" onMouseDown={onClose}><div className="docs-command" role="dialog" aria-modal="true" aria-label="Cerca documentazione" onMouseDown={(event) => event.stopPropagation()}><div className="docs-command-input"><Search size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca in ABBO Docs…" /><kbd>Esc</kbd></div><div className="docs-command-results">{matches.map((doc) => <button type="button" key={doc.slug} onClick={() => { navigate(`/docs/${doc.slug}`); onClose(); }}><BookOpen size={16} /><span><b>{doc.title}</b><small>{doc.category}</small></span><ArrowRight size={15} /></button>)}{matches.length === 0 && <p>Nessun risultato. Prova con “NFC”, “ricevute” o “PWA”.</p>}</div></div></div>;
}

function DocsHome({ onSearch, modeFilter }: { onSearch: () => void; modeFilter?: DocMode }) {
  const navigate = useNavigate();
  const modes = Object.entries(modeLabels) as Array<[keyof typeof modeLabels, typeof modeLabels.impara]>;
  const roleCards: Array<[string, string, string]> = [["Sono un socio", "Installazione, tessera, QR e ricevute.", "soci/installazione"], ["Lavoro nello staff", "Procedure quotidiane e controlli.", "staff/panoramica"], ["Gestisco ABBO", "Registri, economia e responsabilità.", "economia/panoramica"], ["Integro l'NFC", "Flussi pubblici e API versionate.", "nfc/verifica-pubblica"]];
  const filtered = modeFilter ? docs.filter((doc) => doc.mode === modeFilter).slice(0, 6) : [];
  return <div className="docs-home"><section className="docs-hero"><div className="docs-hero-copy"><span className="docs-kicker">ABBO <em>DOCS</em> / MANUALE UFFICIALE</span><h1>Tutto quello che serve per <i>capire</i>, usare e gestire l'ecosistema ABBO.</h1><p>APP SOCI, ricevute, registri, economia, tessere digitali, NFC e API. Spiegati bene.</p><button className="docs-search-hero" type="button" onClick={onSearch}><Search size={20} /><span>Cerca nella documentazione…</span><kbd>⌘ K</kbd></button></div><div className="docs-hero-orbit" aria-hidden="true"><div className="docs-orbit-ring ring-one" /><div className="docs-orbit-ring ring-two" /><div className="docs-orbit-core"><span>ABBO</span><b>DOCS</b></div><span className="docs-orbit-label label-one">Impara</span><span className="docs-orbit-label label-two">Usa</span><span className="docs-orbit-label label-three">Capisci</span></div></section><section className="docs-mode-grid" aria-labelledby="modes-title"><div className="docs-section-intro"><span className="docs-kicker">Tre prospettive</span><h2 id="modes-title">Da dove vuoi iniziare?</h2></div>{modes.map(([key, mode]) => <button type="button" key={key} className={`docs-mode-card mode-${key}`} onClick={() => navigate(`/docs?mode=${key}`)}><span>{mode.eyebrow}</span><strong>{mode.label}</strong><p>{mode.description}</p><ArrowRight size={18} /></button>)}</section>{modeFilter && <section className="docs-filter-results" aria-labelledby="filter-title"><div className="docs-section-intro"><span className="docs-kicker">Percorso selezionato</span><h2 id="filter-title">{modeLabels[modeFilter].label}</h2></div><div className="docs-filter-grid">{filtered.map((doc) => <Link to={`/docs/${doc.slug}`} key={doc.slug}><span>{doc.category}</span><b>{doc.title}</b><p>{doc.description}</p><ArrowRight size={16} /></Link>)}</div></section>}<section className="docs-start-grid" aria-labelledby="start-title"><div className="docs-section-intro"><span className="docs-kicker">Orientamento</span><h2 id="start-title">Da dove vuoi iniziare?</h2></div>{roleCards.map(([title, desc, href]) => <Link to={`/docs/${href}`} className="docs-start-card" key={title}><span className="docs-start-number">0{roleCards.findIndex((item) => item[0] === title) + 1}</span><h3>{title}</h3><p>{desc}</p><ArrowRight size={18} /></Link>)}</section><DocsMap /><Tours /><NfcExplorer /><TemplateMap /></div>;
}

function Sidebar({ selectedRole, onRoleChange, onSearch, onClose }: { selectedRole: DocRole | null; onRoleChange: (role: DocRole | null) => void; onSearch: () => void; onClose?: () => void }) {
  return <aside className="docs-sidebar"><div className="docs-sidebar-top"><button className="docs-mobile-close" type="button" onClick={onClose} aria-label="Chiudi menu"><X size={20} /></button><button type="button" className="docs-sidebar-search" onClick={onSearch}><Search size={16} /> Cerca <kbd>⌘K</kbd></button><div className="docs-role-filter"><span>Sto leggendo come</span><select value={selectedRole ?? ""} onChange={(event) => onRoleChange((event.target.value || null) as DocRole | null)} aria-label="Filtra per ruolo"><option value="">Tutte le prospettive</option>{Object.entries(roleLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div></div><nav aria-label="Navigazione documentazione">{categoryOrder.map((category) => { const items = docs.filter((doc) => doc.category === category && (!selectedRole || doc.roles.includes(selectedRole))); if (!items.length) return null; return <div className="docs-nav-group" key={category}><span className="docs-nav-heading">{category}</span>{items.map((doc) => <Link key={doc.slug} to={`/docs/${doc.slug}`} onClick={onClose}><span>{doc.title}</span><StatusBadge status={doc.status} /></Link>)}</div>; })}</nav></aside>;
}

function DocPageView({ doc, onOpenSidebar }: { doc: DocPage; onOpenSidebar: () => void }) {
  const index = docs.findIndex((item) => item.slug === doc.slug); const previous = docs[index - 1]; const next = docs[index + 1];
  const headings = [...doc.body.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  return <article className="docs-article"><div className="docs-mobile-toolbar"><button type="button" onClick={onOpenSidebar}><Menu size={18} /> Sezioni</button><Link to="/docs"><BookOpen size={18} /> Home Docs</Link></div><Breadcrumbs doc={doc} /><header className="docs-article-header"><div className="docs-article-kicker"><span>{doc.category}</span><StatusBadge status={doc.status} /></div><h1>{doc.title}</h1><p>{doc.description}</p><div className="docs-article-meta"><span>Ultima revisione: {doc.lastReviewed}</span><span>•</span><span>{modeLabels[doc.mode].label}</span></div></header><div className="docs-article-layout"><div><DocMarkdown body={doc.body} /><div className="docs-article-feedback"><span>Ti è stata utile questa pagina?</span><button type="button" aria-label="Sì"><Check size={16} /></button><button type="button" aria-label="No"><X size={16} /></button><a href="mailto:info@abboaps.org?subject=Errore%20in%20ABBO%20Docs">Segnala un errore</a></div>{doc.related && <div className="docs-related"><span className="docs-kicker">Continua con</span><div>{doc.related.map((slug) => { const related = docBySlug.get(slug); return related ? <Link to={`/docs/${related.slug}`} key={slug}><span>{related.category}</span><b>{related.title}</b><ArrowRight size={16} /></Link> : null; })}</div></div>}<div className="docs-prevnext">{previous ? <Link to={`/docs/${previous.slug}`}><ArrowLeft size={16} /><span>Precedente<small>{previous.title}</small></span></Link> : <span />}{next && <Link to={`/docs/${next.slug}`}><span>Successiva<small>{next.title}</small></span><ArrowRight size={16} /></Link>}</div></div>{headings.length > 0 && <aside className="docs-toc"><span>In questa pagina</span>{headings.map((heading) => <a href={`#${slugify(heading)}`} key={heading}>{heading}</a>)}</aside>}</div></article>;
}

export function Docs() {
  const location = useLocation(); const navigate = useNavigate();
  const [commandOpen, setCommandOpen] = useState(false); const [mobileOpen, setMobileOpen] = useState(false); const [selectedRole, setSelectedRole] = useState<DocRole | null>(null);
  useEffect(() => { const listener = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen(true); } if (event.key === "Escape") setCommandOpen(false); }; window.addEventListener("keydown", listener); return () => window.removeEventListener("keydown", listener); }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [location.pathname]);
  const slug = location.pathname.replace(/^\/docs\/?/, "").replace(/\/$/, ""); const doc = slug ? docBySlug.get(slug) : undefined; const requestedMode = new URLSearchParams(location.search).get("mode"); const modeFilter = requestedMode === "impara" || requestedMode === "usa" || requestedMode === "capisci" ? requestedMode : undefined;
  const openSearch = () => setCommandOpen(true);
  if (slug && !doc) return <div className="docs-shell"><Sidebar selectedRole={selectedRole} onRoleChange={setSelectedRole} onSearch={openSearch} /><main className="docs-main docs-empty"><CircleHelp size={42} /><h1>Questa pagina non c'è.</h1><p>La risposta, forse, è nella ricerca.</p><button type="button" className="docs-button" onClick={openSearch}><Search size={16} /> Cerca nelle Docs</button></main><CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} /></div>;
  return <div className="docs-shell"><Sidebar selectedRole={selectedRole} onRoleChange={setSelectedRole} onSearch={openSearch} /><main className="docs-main">{doc ? <DocPageView doc={doc} onOpenSidebar={() => setMobileOpen(true)} /> : <DocsHome onSearch={openSearch} modeFilter={modeFilter} />}</main><button type="button" className="docs-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Apri sezioni"><Menu size={20} /></button>{mobileOpen && <div className="docs-mobile-overlay" onClick={() => setMobileOpen(false)} />}{mobileOpen && <div className="docs-mobile-sidebar"><Sidebar selectedRole={selectedRole} onRoleChange={setSelectedRole} onSearch={openSearch} onClose={() => setMobileOpen(false)} /></div>}<CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} /></div>;
}

export function DocsCount() { return <span>{docs.length} pagine redatte</span>; }
