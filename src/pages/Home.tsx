import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, CalendarDays, HeartHandshake, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import homeConfig from "../config/home.json";
import projectData from "../config/projects.json";
import { organization } from "../config/organization";
import { dataNews, type Articolo } from "../data/newsData";
import { Project } from "../types";
import { SEO } from "../components/SEO";
import { CopyableValue } from "../components/CopyableValue";
import { PressMentions } from "../components/PressMentions";
import { generateNgoSchema } from "../utils/seo-microdata";
import festivalImage from "../assets/home-projects/IMG_1101.webp";

const baseUrl = import.meta.env.BASE_URL;
const carouselModules = import.meta.glob(
  "../assets/home-carousel/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const carouselImages = Object.entries(carouselModules)
  .sort(([first], [second]) => first.localeCompare(second))
  .map(([, src]) => src);

function asset(path: string): string {
  return path.startsWith("/") ? `${baseUrl}${path.slice(1)}` : path;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function ProjectLink({ project, children }: { project: Project; children: React.ReactNode }) {
  if (project.url?.startsWith("http")) {
    return (
      <a href={project.url} target="_blank" rel="noopener noreferrer" className="home-project-card__link">
        {children}
      </a>
    );
  }

  return <Link to={project.url || "/link"} className="home-project-card__link">{children}</Link>;
}

function ProjectCard({ project }: { project: Project }) {
  const isFestival = project.id === "abbiamo";
  const copy = isFestival
    ? "Una fiera delle associazioni per incontrarsi, fare rete e partecipare."
    : "Laboratori per imparare tecnologia, robotica e cittadinanza digitale.";

  return (
    <article className="home-project-card">
      <ProjectLink project={project}>
        <div className="home-project-card__image">
          <img
            src={isFestival ? festivalImage : asset(project.bg_src)}
            alt=""
            width="960"
            height="640"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="home-project-card__body">
          <div className="home-project-card__topline">
            <span>{isFestival ? "Territorio" : "Educazione"}</span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </div>
          {project.icon && <img src={asset(project.icon)} alt="" width="400" height="260" className="home-project-card__logo" loading="lazy" />}
          <h3>{project.title}</h3>
          <p>{copy}</p>
          <span className="home-text-link">{project.cta || "Scopri il progetto"} <ArrowUpRight size={17} aria-hidden="true" /></span>
        </div>
      </ProjectLink>
    </article>
  );
}

function NewsCard({ article, featured = false }: { article: Articolo; featured?: boolean }) {
  return (
    <Link to={`/news/${article.id}`} className={featured ? "home-news-card home-news-card--featured" : "home-news-card"}>
      <img src={asset(article.immagine)} alt="" width="960" height="503" loading="lazy" decoding="async" />
      <div className="home-news-card__body">
        <time dateTime={article.data}>{formatDate(article.data)}</time>
        <h3>{article.titolo}</h3>
        <p>{article.estratto}</p>
        <span className="home-text-link">Leggi la news <ArrowUpRight size={16} aria-hidden="true" /></span>
      </div>
    </Link>
  );
}

function HeroCarousel() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || carouselImages.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % carouselImages.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="home-hero__slides" aria-hidden="true">
      {carouselImages.map((src, index) => (
        <img
          key={src}
          className={index === activeIndex ? "home-hero__slide home-hero__slide--active" : "home-hero__slide"}
          src={src}
          alt=""
          width="2000"
          height="1333"
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          decoding="async"
        />
      ))}
    </div>
  );
}

export function Home() {
  const jsonLd = generateNgoSchema();
  const actualProjects = (projectData as Project[]).filter((project) => project.id !== "hero-air");
  const recentNews = [...dataNews]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 3);

  return (
    <>
      <SEO
        title="Creiamo i momenti a cui vorresti tornare"
        description="ABBO APS crea spazi, laboratori ed eventi per giovani, famiglie e associazioni. Idee concrete, persone e territorio: cose che succedono davvero."
        image="/media/home/hero-desktop.webp"
        url="/"
      >
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </SEO>

      <a href="#main-content" className="home-skip-link">Vai al contenuto</a>
      <main id="main-content" className="home-page">
        <section className="home-hero" aria-labelledby="home-hero-title">
          <HeroCarousel />
          <div className="home-hero__wash" aria-hidden="true" />
          <motion.div
            className="home-shell home-hero__content"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <img src={asset(homeConfig.association_logo)} alt="ABBO APS" className="home-hero__logo" width="220" height="220" />
            <div className="home-hero__copy">
              <h1 id="home-hero-title">
                <span>Creiamo i momenti a</span>
                <span>cui vorresti tornare.</span>
              </h1>
              <p className="home-hero__microcopy">Progetti, Persone, Giovani e Territorio.</p>
              <div className="home-actions">
                <a href="#progetti" className="home-button home-button--light">Scopri i progetti <ArrowDownRight size={18} aria-hidden="true" /></a>
                <Link to="/contatti" className="home-button home-button--outline">Partecipa <ArrowUpRight size={18} aria-hidden="true" /></Link>
              </div>
            </div>
          </motion.div>
          <a href="#progetti" className="home-hero__scroll" aria-label="Scorri ai progetti"><span /> Scorri</a>
        </section>

        <section id="progetti" className="home-section home-section--projects" aria-labelledby="projects-title">
          <div className="home-shell">
            <div className="home-section-heading">
              <div>
                <h2 id="projects-title" className="home-title home-title--small">I nostri progetti</h2>
                <p className="home-section-lede">Idee concrete, costruite con le persone del territorio.</p>
              </div>
              <Link to="/link" className="home-text-link">Vedi tutti <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
            <div className="home-project-grid">
              {actualProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          </div>
        </section>

        <section className="home-section home-section--feature" aria-labelledby="now-title">
          <div className="home-shell">
            <div className="home-section-heading">
              <div>
                <h2 id="now-title" className="home-title home-title--small">Festival ABBIAMO</h2>
                <p className="home-section-lede">Una giornata per incontrare chi fa vivere il territorio.</p>
              </div>
              <span className="home-heading-note">4 ottobre 2026</span>
            </div>
            <article className="home-feature">
              <div className="home-feature__media"><img src={asset("/media/banner_abbiamo_26.jpg")} alt="Festival ABBIAMO, fiera delle associazioni del territorio" width="960" height="503" loading="lazy" decoding="async" /></div>
              <div className="home-feature__body">
                <div className="home-feature__meta"><span><CalendarDays size={17} aria-hidden="true" /> 4 ottobre 2026</span><span><MapPin size={17} aria-hidden="true" /> Verderio (LC)</span></div>
                <h3>Una fiera da vivere</h3>
                <p>Associazioni, volontari e cittadini nello stesso posto, con attività, talk e storie da incontrare.</p>
                <Link to="/abbiamo/" className="home-button home-button--dark">Scopri il Festival <ArrowUpRight size={18} aria-hidden="true" /></Link>
              </div>
            </article>
          </div>
        </section>

        <PressMentions variant="abbo" />

        <section id="news" className="home-section home-section--news" aria-labelledby="news-title">
          <div className="home-shell">
            <div className="home-section-heading">
              <div>
                <h2 id="news-title" className="home-title home-title--small">Le ultime da ABBO</h2>
                <p className="home-section-lede">Appuntamenti, storie e cose appena successe.</p>
              </div>
              <Link to="/notizie" className="home-text-link">Tutte le news <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
            <div className="home-news-grid">
              {recentNews[0] && <NewsCard article={recentNews[0]} featured />}
              <div className="home-news-list">{recentNews.slice(1).map((article) => <NewsCard key={article.id} article={article} />)}</div>
            </div>
          </div>
        </section>

        <section id="sostieni" className="home-section home-section--support" aria-labelledby="support-title">
          <div className="home-shell">
            <div className="home-support">
              <div className="home-support__copy">
                <h2 id="support-title">Destina il tuo 5×1000 ad ABBO APS</h2>
                <p>Il tuo gesto sostiene laboratori, attività e momenti di aggregazione per i giovani.</p>
                <div className="home-support__links">
                  <a href={organization.paypalUrl} target="_blank" rel="noopener noreferrer" className="home-button home-button--light">Dona con PayPal <ArrowUpRight size={18} aria-hidden="true" /></a>
                  <Link to="/sostienici" className="home-text-link home-text-link--light">Altri modi per sostenere ABBO <ArrowUpRight size={17} aria-hidden="true" /></Link>
                </div>
              </div>
              <div className="home-support__code">
                <HeartHandshake size={30} aria-hidden="true" />
                <span>5×1000</span>
                <p>Codice fiscale ABBO APS</p>
                <CopyableValue value={organization.taxCode} copyLabel="Copia il codice fiscale ABBO APS" actionLabel="Copia" copiedLabel="Copiato" className="home-copy" valueClassName="home-copy__value" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
