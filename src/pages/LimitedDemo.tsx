import { type ReactElement, useState } from "react";
import { Helmet } from "react-helmet-async";

import "../styles/limited-verification.css";

const RANDOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const DEMO_TOTAL = 200;

export interface LimitedDemoData {
  editionCode: string;
  editionId: string;
  itemId: string;
  title: string;
  description: string;
  serial: number;
  total: number;
  issuedDate: string;
  pairingCode: string;
}

function randomIndex(max: number): number {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const values = new Uint32Array(1);
    cryptoApi.getRandomValues(values);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function randomText(length: number): string {
  return Array.from({ length }, () => RANDOM_ALPHABET[randomIndex(RANDOM_ALPHABET.length)]).join("");
}

export function createLimitedDemoData(now = new Date()): LimitedDemoData {
  const year = now.getUTCFullYear();
  const serial = randomIndex(DEMO_TOTAL) + 1;
  const editionSuffix = randomText(8);
  const itemSuffix = randomText(8);

  return {
    editionCode: `DEMO-${year}-${randomText(4)}`,
    editionId: `ed_demo_${editionSuffix}`,
    itemId: `it_demo_${itemSuffix}`,
    title: "Poster ABBO APS — Edizione Limitata Demo",
    description: "Questa scheda mostra l’aspetto della verifica di un prodotto in edizione limitata con dati sintetici generati nel browser.",
    serial,
    total: DEMO_TOTAL,
    issuedDate: now.toISOString().slice(0, 10),
    pairingCode: `${randomText(4)}-${randomText(4)}-${randomText(4)}`,
  };
}

export function LimitedDemo(): ReactElement {
  const [demo, setDemo] = useState(() => createLimitedDemoData());
  const [pairingShown, setPairingShown] = useState(false);

  const regenerate = () => {
    setDemo(createLimitedDemoData());
    setPairingShown(false);
  };

  return (
    <>
      <Helmet>
        <title>Demo verifica edizione limitata — ABBO APS</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Helmet>

      <main className="limited-demo-page" aria-labelledby="limited-demo-title">
        <section className="limited-demo-card">
          <div className="limited-demo-banner" role="note">
            DEMO — ANTEPRIMA NON AUTENTICA
          </div>

          <header className="limited-demo-header">
            <p className="limited-demo-eyebrow">ABBO APS · `/limited/demo`</p>
            <h1 id="limited-demo-title">Esempio di verifica prodotto</h1>
            <p>
              Questa pagina serve per vedere il risultato grafico atteso. I dati sotto sono
              placeholder casuali e cambiano a ogni caricamento o rigenerazione.
            </p>
          </header>

          <div className="limited-demo-content">
            <div className="limited-demo-status" aria-live="polite">
              <span className="limited-demo-check" aria-hidden="true">✓</span>
              <div>
                <strong>Esempio di esito positivo</strong>
                <span>In una verifica reale questo esito dipende da firma, keyring e manifesto validi.</span>
              </div>
            </div>

            <div className="limited-demo-image" role="img" aria-label="Placeholder immagine prodotto demo">
              <span>IMMAGINE PRODOTTO</span>
              <small>placeholder demo</small>
            </div>

            <h2>{demo.title}</h2>
            <p className="limited-demo-description">{demo.description}</p>

            <div className="limited-demo-serial">
              <span>Numero esemplare</span>
              <strong>{demo.serial} di {demo.total}</strong>
            </div>

            <dl className="limited-demo-meta">
              <div>
                <dt>Codice edizione</dt>
                <dd>{demo.editionCode}</dd>
              </div>
              <div>
                <dt>Data emissione</dt>
                <dd>{demo.issuedDate}</dd>
              </div>
              <div>
                <dt>ID edizione</dt>
                <dd>{demo.editionId}</dd>
              </div>
              <div>
                <dt>ID esemplare</dt>
                <dd>{demo.itemId}</dd>
              </div>
            </dl>

            <div className="limited-demo-reminder">
              <strong>Controllo consigliato</strong>
              <p>In produzione, confronta il numero digitale con quello stampato, inciso o ricamato sul prodotto fisico.</p>
            </div>

            <div className="limited-demo-pairing">
              <h3>Codice fisico di abbinamento</h3>
              <p>Anteprima del campo che può essere mostrato quando il token reale contiene un pairing code.</p>
              <div className="limited-demo-pairing-row">
                <input aria-label="Codice pairing demo" placeholder="es. M7RQ-8K4P-2TXD" readOnly />
                <button type="button" onClick={() => setPairingShown(true)}>Verifica demo</button>
              </div>
              {pairingShown && <p className="limited-demo-pairing-success">✓ Abbinamento simulato — codice esempio: {demo.pairingCode}</p>}
            </div>

            <div className="limited-demo-actions">
              <button type="button" className="limited-demo-regenerate" onClick={regenerate}>
                Genera nuovi placeholder
              </button>
              <p>
                Il pulsante non crea token validi e non modifica dati pubblici: rigenera soltanto l’anteprima locale.
              </p>
            </div>

            <details className="limited-demo-explanation">
              <summary>Cosa cambia nella pagina reale?</summary>
              <p>
                La pagina reale riceve un token AB1, verifica la firma ECDSA, carica il manifesto
                dell’edizione e controlla l’hash dell’immagine prima di mostrare l’esito.
              </p>
            </details>
          </div>
        </section>
      </main>
    </>
  );
}
