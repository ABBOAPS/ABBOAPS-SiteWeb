import { Globe2, Instagram } from "lucide-react";

export function LimitedLinks() {
  return (
    <nav className="limited-links" aria-label="Link ABBO APS">
      <a href="https://instagram.com/abboaps" target="_blank" rel="noreferrer">
        <Instagram size={17} strokeWidth={1.8} aria-hidden="true" />
        Instagram
      </a>
      <a href="https://www.abboaps.org" target="_blank" rel="noreferrer">
        <Globe2 size={17} strokeWidth={1.8} aria-hidden="true" />
        abboaps.org
      </a>
    </nav>
  );
}
