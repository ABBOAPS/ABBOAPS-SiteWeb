import { LegalMarkdownPage } from "../components/LegalMarkdownPage";
import { aiTransparencyMarkdown } from "../data/aiData";

export function AiTransparency() {
  return <LegalMarkdownPage title="Trasparenza IA" description="Stato e impegni di ABBO APS sull’uso dell’intelligenza artificiale." url="/trasparenza-ia" content={aiTransparencyMarkdown} />;
}
