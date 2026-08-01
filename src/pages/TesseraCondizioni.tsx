import mdContent from "../content/docs/tessera_condizioni.md?raw";
import { TesseraMarkdownViewer } from "../components/TesseraMarkdownViewer";

export function TesseraCondizioni() {
  return (
    <TesseraMarkdownViewer
      content={mdContent}
      title="Condizioni d’uso della Card NFC"
      seoDescription="Condizioni d’uso trasparenti per la tessera associativa NFC ABBO APS: natura della card, modalità di verifica, clonabilità e procedura di revoca."
      urlPath="/tessera/condizioni"
      footerLinks={[
        { label: "Informativa Privacy NFC", to: "/tessera/privacy" },
        { label: "Regole Partner", to: "/tessera/partner" },
      ]}
    />
  );
}
