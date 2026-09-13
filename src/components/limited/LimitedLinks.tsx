import { Globe2 } from "lucide-react";
import { SocialLinks } from "../SocialLinks";
import { CreditCard, Landmark } from "lucide-react";
import { organization } from "../../config/organization";

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

export function LimitedSupport() {
  return (
    <section className="limited-support" aria-label="Modalità per sostenere ABBO APS">
      <div className="limited-support__five-mille">
        <span>5×1000</span>
        <p>Destinalo ad ABBO APS</p>
        <strong>Codice fiscale {organization.taxCode}</strong>
      </div>
      <div className="limited-support__actions">
        <a href={organization.paypalUrl} target="_blank" rel="noopener noreferrer">
          <CreditCard size={18} strokeWidth={1.8} aria-hidden="true" />
          PayPal
        </a>
        <a href="/sostienici#support-options">
          <Landmark size={18} strokeWidth={1.8} aria-hidden="true" />
          Bonifico
        </a>
      </div>
    </section>
  );
}
