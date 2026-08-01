import mdContent from "../content/docs/tessera_privacy.md?raw";
import { TesseraMarkdownViewer } from "../components/TesseraMarkdownViewer";

export function TesseraPrivacy() {
  return (
    <TesseraMarkdownViewer
      content={mdContent}
      title="Informativa Privacy Card NFC"
      seoDescription="Informativa specifica ex artt. 13-14 GDPR sul trattamento dei dati personali legato al servizio ed alla verifica della Card NFC ABBO APS."
      urlPath="/tessera/privacy"
      footerLinks={[
        { label: "Condizioni d'uso", to: "/tessera/condizioni" },
        { label: "Regole Partner", to: "/tessera/partner" },
      ]}
    />
  );
}
