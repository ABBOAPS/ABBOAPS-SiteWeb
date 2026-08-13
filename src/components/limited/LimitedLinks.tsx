import { Globe2 } from "lucide-react";
import { SocialLinks } from "../SocialLinks";

export function LimitedLinks() {
  return (
    <div className="limited-links">
      <SocialLinks variant="limited" />
      <a className="limited-links__item limited-links__item--website" href="https://www.abboaps.org" target="_blank" rel="noreferrer">
        <Globe2 size={17} strokeWidth={1.8} aria-hidden="true" />
        abboaps.org
      </a>
    </div>
  );
}
