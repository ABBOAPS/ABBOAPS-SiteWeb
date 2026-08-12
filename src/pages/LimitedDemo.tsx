import { type ReactElement, useState } from "react";
import { Globe2, Instagram } from "lucide-react";
import { Helmet } from "react-helmet-async";

import "../styles/limited-verification.css";

const RANDOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const DEMO_TOTAL = 200;

export interface LimitedDemoData {
  editionCode: string;
  title: string;
  serial: number;
  total: number;
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
  return {
    editionCode: `DEMO-${now.getUTCFullYear()}-${randomText(4)}`,
    title: "Poster ABBO APS",
    serial: randomIndex(DEMO_TOTAL) + 1,
    total: DEMO_TOTAL,
  };
}

export function LimitedDemo(): ReactElement {
  const [demo] = useState(() => createLimitedDemoData());

  return (
    <>
      <Helmet>
        <title>Demo verifica edizione limitata — ABBO APS</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Helmet>

      <main className="limited-demo-page" aria-labelledby="limited-demo-title">
        <section className="limited-demo-card">
          <div className="limited-demo-image">
            <img src="/media/spazio-ragazzi.jpg" alt="Foto demo ABBO APS" />
            <span className="limited-demo-tag">DEMO</span>
            <span className="limited-demo-verified" aria-label="Stato demo: verificato">
              VERIFICATO
            </span>
          </div>

          <div className="limited-demo-content">
            <p className="limited-demo-eyebrow">ABBO APS · LIMITED EDITION</p>
            <h1 id="limited-demo-title">{demo.title}</h1>

            <div className="limited-demo-details">
              <div>
                <span>Edizione</span>
                <strong>{demo.editionCode}</strong>
              </div>
              <div>
                <span>Numero</span>
                <strong>{String(demo.serial).padStart(3, "0")} / {demo.total}</strong>
              </div>
            </div>

            <nav className="limited-demo-socials" aria-label="Social ABBO APS">
              <a href="https://instagram.com/abboaps" target="_blank" rel="noreferrer">
                <Instagram size={18} aria-hidden="true" />
                Instagram
              </a>
              <a href="https://www.abboaps.org" target="_blank" rel="noreferrer">
                <Globe2 size={18} aria-hidden="true" />
                abboaps.org
              </a>
            </nav>

            <p className="limited-demo-note">Anteprima grafica con dati casuali generati nel browser.</p>
          </div>
        </section>
      </main>
    </>
  );
}
