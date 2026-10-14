import { pressMentions } from "../data/pressMentions";

export type PressMentionsVariant = "abbo" | "abbiamo";

const viteBaseUrl = import.meta.env?.BASE_URL ?? "/";

function publicAsset(path: string): string {
  const inCrawlableEntry = typeof window !== "undefined" && /^\/abbiamo\/?$/.test(window.location.pathname);
  const baseUrl = inCrawlableEntry && viteBaseUrl === "./" ? "../" : viteBaseUrl;
  return `${baseUrl}${path.replace(/^\/+/, "")}`;
}

export function PressMentions({ variant }: { variant: PressMentionsVariant }) {
  return (
    <section id={`press-mentions-${variant}`} className={`press-mentions press-mentions--${variant}`} aria-labelledby={`press-mentions-title-${variant}`}>
      <div className="press-mentions__shell">
        <div className="press-mentions__intro">
          <h2 id={`press-mentions-title-${variant}`} className="press-mentions__heading">Parlano di noi</h2>
          <p>Il Festival ABBIAMO è stato raccontato prima e dopo la sua prima edizione.</p>
          <a href={`${viteBaseUrl}abbiamo/`} className="press-mentions__project-link">Scopri ABBIAMO <span aria-hidden="true">↗</span></a>
        </div>

        <div className="press-mentions__list">
          {pressMentions.map((mention) => (
            <article className="press-mention" key={`${mention.publication}-${mention.url}`}>
              <div className="press-mention__publication">
                <img
                  src={publicAsset(mention.publicationLogo)}
                  alt={mention.publication}
                  width="530"
                  height="530"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <time dateTime={mention.dateTime}>{mention.date}</time>
              <h3>{mention.title}</h3>
              <p>{mention.excerpt}</p>
              <a href={mention.url} target="_blank" rel="noopener noreferrer" className="press-mention__link">
                Leggi l’articolo <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
