import { LegalMarkdownPage } from "../components/LegalMarkdownPage";
import { cookieMarkdown } from "../data/cookieData";

export function CookiePolicy() {
  return <LegalMarkdownPage title="Cookie Policy" description="Informazioni sui cookie e sugli strumenti tecnici usati da ABBO APS." url="/cookie-policy" content={cookieMarkdown} />;
}
