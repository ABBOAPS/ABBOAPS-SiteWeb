import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, CalendarDays, Handshake, Heart, Instagram, Landmark, Linkedin, Mail, MessageCircle, Music2 } from "lucide-react";
import { Link } from "react-router-dom";
import { type ReactNode } from "react";
import { SEO } from "../components/SEO";
import projectData from "../config/projects.json";
import siteConfig from "../config/site_config.json";
import contattiConfig from "../config/contatti.json";
import { organization } from "../config/organization";
import { CopyableValue } from "../components/CopyableValue";
import type { Project } from "../types";
import "../styles/projects.css";

const socialLinks = [
  { label: "Instagram", href: siteConfig.socials.instagram, icon: Instagram },
  { label: "TikTok", href: siteConfig.socials.tiktok, icon: Music2 },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, icon: Linkedin },
  { label: "Discord", href: siteConfig.socials.discord, icon: MessageCircle },
];

const projects = (projectData as Project[]).filter((project) => project.id !== "hero-air" && project.url);

function ProjectLink({ project, children, className, ariaLabel }: { project: Project; children: ReactNode; className?: string; ariaLabel?: string }) {
  const props = { "aria-label": ariaLabel, className: className ?? "projects-card-link" };
  if (project.url?.startsWith("/")) return <Link {...props} to={project.url}>{children}</Link>;
  return <a {...props} href={project.url} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article className={`projects-card projects-card--${project.id}`} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.06 }}>
      <ProjectLink project={project} className="projects-card-visual" ariaLabel={`Apri ${project.title}`}>
        <img src={project.bg_src} alt="" loading={index === 0 ? "eager" : "lazy"} />
        {project.icon && <img className="projects-card-mark" src={project.icon} alt="" loading="lazy" />}
      </ProjectLink>
      <div className="projects-card-copy">
        <h2>{project.title}</h2>
        <ProjectLink project={project}>Apri <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.2} /></ProjectLink>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="projects-page" aria-labelledby="projects-title">
      <SEO title="ABBO — Link" description="I progetti e i social di ABBO APS." url="/link" />
      <div className="projects-shell">
        <motion.a className="projects-logo" href="#projects-title" initial={reduceMotion ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <img src={siteConfig.logo_horizontal} alt="ABBO APS" width="220" height="62" />
        </motion.a>
        <h1 id="projects-title" className="sr-only">ABBO APS</h1>
        <nav className="projects-socials" aria-label="Social ABBO APS">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`ABBO APS su ${label}`}>
              <Icon size={20} aria-hidden="true" /><span>{label}</span>
            </a>
          ))}
        </nav>

        <section className="projects-actions" aria-label="Eventi e collaborazioni">
          <Link to="/abbiamo"><CalendarDays size={20} aria-hidden="true" /><span>Eventi</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
          <Link to="/contatti"><Handshake size={20} aria-hidden="true" /><span>Collaborazioni</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
        </section>

        <section className="projects-grid" aria-label="Progetti ABBO">
          {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
        </section>

        <section className="projects-support" aria-label="Sostieni ABBO APS">
          <article>
            <div className="projects-support-heading"><span>5×1000</span><Heart size={20} aria-hidden="true" /></div>
            <CopyableValue value={organization.taxCode} copyLabel="Copia codice fiscale ABBO APS" actionLabel="Copia" className="projects-value-copy" valueClassName="projects-value-number" />
          </article>
          <article>
            <div className="projects-support-heading"><span>Bonifico</span><Landmark size={20} aria-hidden="true" /></div>
            <CopyableValue value={organization.iban} copyLabel="Copia IBAN ABBO APS" actionLabel="Copia" className="projects-value-copy" valueClassName="projects-value-number projects-value-number--iban" />
          </article>
        </section>

        <a className="projects-contact" href={`mailto:${contattiConfig.info.email_value}`}>
          <Mail size={20} aria-hidden="true" /><span>Contattaci</span><small>{contattiConfig.info.email_value}</small><ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
    </main>
  );
}
