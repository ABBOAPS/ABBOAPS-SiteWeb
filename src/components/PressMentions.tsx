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
        <h2 id={`press-mentions-title-${variant}`} className="press-mentions__heading">Parlano di noi</h2>

        <div className="press-mentions__list">
          {pressMentions.map((mention) => (
            <figure className="press-mention" key={`${mention.publication}-${mention.url}`}>
              <div className="press-mention__publication">
                <a
                  href={mention.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Apri l'articolo di ${mention.publication}`}
                >
                  <span className="press-mention__publication-logo">
                    <img
                      src={publicAsset(mention.publicationLogo)}
                      alt={mention.publication}
                      width={530}
                      height={530}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                </a>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
