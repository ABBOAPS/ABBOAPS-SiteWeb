import { LegalMarkdownPage } from "../components/LegalMarkdownPage";
import { termsMarkdown } from "../data/termsData";

export function TermsAndConditions() {
  return <LegalMarkdownPage title="Termini e condizioni" description="Termini di utilizzo del sito ABBO APS e di ABBO APP." url="/termini-e-condizioni" content={termsMarkdown} />;
}
