import { useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Copy, Heart, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import siteConfig from "../config/site_config.json";
import homeConfig from "../config/home.json";
import projectData from "../config/projects.json";
import { organization } from "../config/organization";
import { abbiamoData } from "../data/abbiamo";
import { OFFICIAL_SOCIALS } from "../config/socials";
import { SEO } from "../components/SEO";
import type { Project } from "../types";
import "../styles/abbo-hub.css";

function isFestivalSeason(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", month: "numeric", day: "numeric" }).formatToParts(date);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  return (month > 6 || (month === 6 && day >= 1)) && (month < 10 || (month === 10 && day <= 15));
}

function HubLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  return <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="hub-link">{children}<ArrowUpRight aria-hidden="true" size={18} /></a>;
}

function CopyValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* selectable value remains available */ }
  }
  return <div className="hub-copy-value"><div><span>{label}</span><strong>{value}</strong></div><button type="button" onClick={copy} aria-label={`Copia ${label}`}>{copied ? <Check size={17} /> : <Copy size={17} />}<span>{copied ? "COPIATO" : "COPIA"}</span></button></div>;
}

export function AbboHub() {
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const source = query.get("src") || query.get("utm_source") || "direct";
  const festivalActive = isFestivalSeason();
  const projects = (projectData as Project[]).filter((project) => project.id !== "hero-air");
  const socials = OFFICIAL_SOCIALS.filter(({ platform }) => ["instagram", "tiktok", "linkedin"].includes(platform));
  const partner = homeConfig.partners[0];

  return <div className="abbo-hub">
    <SEO title="ABBO — Entra" description="Progetti, eventi e persone ABBO APS. Tutto da qui." url="/link" />
    <header className="hub-hero">
      <img className="hub-hero-photo" src={homeConfig.hero_background} alt="" fetchPriority="high" />
      <div className="hub-hero-shade" />
      <div className="hub-hero-content">
        <a href="#adesso" className="hub-mark"><img src={siteConfig.logo_horizontal} alt="ABBO APS" width="180" height="50" /></a>
        <div className="hub-hero-copy"><span className="hub-eyebrow">ABBO APS / HUB</span><h1>Progetti, eventi<br />e persone.</h1><p>Tutto da qui.</p></div>
        <div className="hub-primary-links" aria-label="Destinazioni principali">
          <a href="#adesso" className="hub-primary-link hub-primary-link--active"><span>COSA SUCCEDE</span><small>Eventi, Festival, laboratori</small><ArrowDown size={18} /></a>
          <a href="#partecipa" className="hub-primary-link"><span>PARTECIPA</span><small>Vieni a fare qualcosa con noi</small><ArrowDown size={18} /></a>
          <a href="#progetti" className="hub-primary-link"><span>PROGETTI</span><small>Digital Heroes, ABBIAMO e altro</small><ArrowDown size={18} /></a>
        </div>
      </div>
      <span className="hub-hero-source">/{source}</span>
    </header>

    <nav className="hub-quick-nav" aria-label="Vai alla sezione"><a href="#adesso">ADESSO</a><a href="#progetti">PROGETTI</a><a href="#community">DISCORD</a><a href="#contatti">CONTATTI</a></nav>

    <main className="hub-main">
      <section className="hub-current hub-section" id="adesso" aria-labelledby="hub-current-title"><div className="hub-section-head"><span>ORA IN ABBO</span><h2 id="hub-current-title">{festivalActive ? "Festival ABBIAMO" : "Stiamo preparando la prossima cosa."}</h2></div><div className="hub-current-detail">{festivalActive ? <><p><strong>{abbiamoData.dateLabel}</strong><br />{abbiamoData.locality} · {abbiamoData.startTime}–{abbiamoData.endTime}</p><HubLink href="/abbiamo">SCOPRI IL FESTIVAL</HubLink></> : <><p>Progetti, eventi e iniziative prendono forma qui.</p><HubLink href="/">SCOPRI ABBO</HubLink></>}</div></section>
      <section className="hub-quick-links hub-section" id="partecipa" aria-labelledby="hub-quick-title"><div className="hub-section-head"><span>SE VUOI ENTRARE</span><h2 id="hub-quick-title">Trova il tuo posto.</h2></div><div className="hub-quick-grid"><Link to="/abbiamo" className="hub-quick-link"><strong>PARTECIPA</strong><span>Eventi e iniziative</span><ArrowUpRight size={18} /></Link><Link to="/contatti" className="hub-quick-link"><strong>DAI UNA MANO</strong><span>Volontariato ABBO</span><Heart size={18} /></Link><Link to="/contatti" className="hub-quick-link"><strong>COLLABORA CON NOI</strong><span>Enti e partner</span><Users size={18} /></Link><a href={siteConfig.socials.discord} target="_blank" rel="noopener noreferrer" className="hub-quick-link"><strong>DISCORD</strong><span>La community ABBO</span><MessageCircle size={18} /></a></div></section>
      <section className="hub-projects hub-section" id="progetti" aria-labelledby="hub-projects-title"><div className="hub-section-head"><span>UNIVERSO ABBO</span><h2 id="hub-projects-title">I progetti.</h2></div><div className="hub-project-list">{projects.map((project) => <a className="hub-project-row" href={project.url || "/"} key={project.id} {...(project.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{project.icon ? <img src={project.icon} alt="" loading="lazy" /> : null}<div><strong>{project.title}</strong><p>{project.description.split(". ")[0]}.</p></div><span>{project.cta || "Scopri"} <ArrowUpRight size={18} /></span></a>)}</div></section>
      <section className="hub-community hub-section" id="community" aria-labelledby="hub-community-title"><div className="hub-section-head"><span>COMMUNITY</span><h2 id="hub-community-title">DISCORD.</h2></div><div><p>Le cose continuano anche dopo gli eventi.</p><HubLink href={siteConfig.socials.discord} external>ENTRA NELLA COMMUNITY</HubLink></div></section>
      <section className="hub-social hub-section" id="social" aria-labelledby="hub-social-title"><div className="hub-section-head"><span>SUI SOCIAL</span><h2 id="hub-social-title">Seguici dove ti pare.</h2></div><div className="hub-social-list">{socials.map((social) => <HubLink key={social.platform} href={social.url} external>{social.label}</HubLink>)}</div></section>
      <section className="hub-contact hub-section" id="contatti" aria-labelledby="hub-contact-title"><div className="hub-section-head"><span>CONTATTI</span><h2 id="hub-contact-title">Hai un’idea strana?</h2></div><div><p>Meglio.</p><div className="hub-contact-links"><HubLink href={siteConfig.socials.whatsapp} external><MessageCircle size={18} /> WhatsApp</HubLink><HubLink href="mailto:info@abboaps.org">✉ info@abboaps.org</HubLink></div></div></section>
      <section className="hub-support hub-section" id="sostieni" aria-labelledby="hub-support-title"><div className="hub-section-head"><span>SOSTEGNO</span><h2 id="hub-support-title">Sostieni ABBO.</h2></div><div className="hub-support-content"><div><strong className="hub-five-label">5×1000</strong><p>Il tuo gesto concreto.</p><CopyValue label="Codice fiscale ABBO APS" value={organization.taxCode} /></div><div className="hub-support-utilities"><a href={organization.paypalUrl} target="_blank" rel="noopener noreferrer">Dona con PayPal <ArrowUpRight size={18} /></a><CopyValue label="IBAN per donazione" value={organization.iban} /></div></div></section>
    </main>
    <div className="hub-partner-note">{partner ? <><span>FACCIAMO COSE ANCHE CON</span><img src={partner.logo} alt="Partner ABBO APS" loading="lazy" /></> : null}</div>
    <footer className="hub-footer"><img src={siteConfig.logo_horizontal} alt="ABBO APS" width="150" height="42" /><span>© 2026 ABBO APS</span><a href="/">Vai al sito ABBO <ArrowUpRight size={16} /></a></footer>
  </div>;
}

export default AbboHub;
