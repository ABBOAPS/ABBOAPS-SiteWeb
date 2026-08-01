import mdContent from "../content/docs/tessera_partner.md?raw";
import { TesseraMarkdownViewer } from "../components/TesseraMarkdownViewer";

export function TesseraPartner() {
  return (
    <TesseraMarkdownViewer
      content={mdContent}
      title="Regole per i Partner Convenzionati"
      seoDescription="Linee guida operative ed obblighi di riservatezza per gli esercenti ed i partner convenzionati che effettuano la verifica della Card NFC ABBO APS."
      urlPath="/tessera/partner"
      footerLinks={[
        { label: "Condizioni d'uso", to: "/tessera/condizioni" },
        { label: "Informativa Privacy NFC", to: "/tessera/privacy" },
      ]}
    />
  );
}
