import { type PointerEvent, useEffect, useRef, useState } from "react";
import { EditionCounter } from "./EditionCounter";
import { LimitedLinks } from "./LimitedLinks";
import { NfcHandoffIndicator } from "./NfcHandoffIndicator";
import { Check } from "lucide-react";
import type { LimitedVerificationData, LimitedVerificationState } from "./limited-types";
import "../../styles/limited-verification.css";

const MINIMUM_HANDOFF_MS = 1_050;

export interface LimitedVerificationExperienceProps extends LimitedVerificationData {
  state: LimitedVerificationState;
  demo?: boolean;
  pairingEnabled?: boolean;
  pairingConfirmed?: boolean;
  pairingError?: boolean;
  onPhysicalPairingSubmit?: (code: string) => void | Promise<void>;
}

function stateCopy(state: LimitedVerificationState): string {
  switch (state) {
    case "verified":
      return "Elemento verificato";
    case "invalid":
      return "Non verificato";
    case "compromised":
      return "Verifica sospesa";
    case "technical":
      return "Verifica non disponibile";
    case "missing":
      return "Apri un link valido";
    case "loading":
    default:
      return "Verifica in corso";
  }
}

function useIntroReady(state: LimitedVerificationState): boolean {
  const startedAt = useRef(Date.now());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setReady(true);
      return undefined;
    }

    if (state === "loading" || state === "missing") {
      setReady(true);
      return undefined;
    }

    const remaining = Math.max(0, MINIMUM_HANDOFF_MS - (Date.now() - startedAt.current));
    const timer = window.setTimeout(() => setReady(true), remaining);
    return () => window.clearTimeout(timer);
  }, [state]);

  return ready;
}

export function LimitedVerificationExperience({
  state,
  demo = false,
  title,
  editionCode,
  serial,
  total,
  imageSrc,
  imageAlt = "Artwork ABBO APS",
  pairingEnabled = false,
  pairingConfirmed = false,
  pairingError = false,
  onPhysicalPairingSubmit,
}: LimitedVerificationExperienceProps) {
  const cardRef = useRef<HTMLElement>(null);
  const introReady = useIntroReady(state);
  const copy = stateCopy(state);
  const verified = state === "verified";
  const showDetails = introReady && (verified || state === "invalid" || state === "compromised" || state === "technical" || state === "missing");

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const card = cardRef.current;
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    card.style.setProperty("--card-rotate-x", `${y * -1}deg`);
    card.style.setProperty("--card-rotate-y", `${x}deg`);
    card.style.setProperty("--card-shift-x", `${x * 2}px`);
    card.style.setProperty("--card-shift-y", `${y * 2}px`);
  };

  const resetPointer = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--card-rotate-x", "0deg");
    card.style.setProperty("--card-rotate-y", "0deg");
    card.style.setProperty("--card-shift-x", "0px");
    card.style.setProperty("--card-shift-y", "0px");
  };

  return (
    <main className={`limited-experience limited-state-${state} ${introReady ? "is-ready" : ""}`}>
      <div className="limited-topline">
        <NfcHandoffIndicator received={state !== "missing"} />
      </div>

      <section
        className="limited-object"
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        aria-labelledby="limited-experience-title"
      >
        <div className="limited-artwork" data-has-image={Boolean(imageSrc)}>
          {imageSrc ? <img src={imageSrc} alt={imageAlt} /> : <div className="limited-artwork-placeholder" aria-hidden="true"><span>ABBO<br />APS</span></div>}
          {demo && <span className="limited-artwork-demo">DEMO</span>}
        </div>

        <div className="limited-content">
          <h1 id="limited-experience-title">{title ?? "Poster ABBO APS"}</h1>

          <div className="limited-status" aria-live="polite">
            {verified ? (
              <span className="limited-status-mark limited-status-mark--verified" aria-hidden="true">
                <Check size={13} strokeWidth={3} />
              </span>
            ) : (
              <span className="limited-status-mark" aria-hidden="true" />
            )}
            <span>{copy}</span>
          </div>

          <EditionCounter current={verified ? serial : undefined} total={verified ? total : undefined} revealed={showDetails} />

          <dl className="limited-edition-meta">
            <div>
              <dt>Edizione</dt>
              <dd>{editionCode ?? "In attesa"}</dd>
            </div>
          </dl>

          {pairingEnabled && onPhysicalPairingSubmit && verified && (
            <form
              className="limited-pairing"
              onSubmit={(event) => {
                event.preventDefault();
                const input = event.currentTarget.elements.namedItem("pairing-code");
                if (input instanceof HTMLInputElement && input.value.trim()) void onPhysicalPairingSubmit(input.value.trim());
              }}
            >
              <label htmlFor="pairing-code">Codice fisico di abbinamento</label>
              <div>
                <input id="pairing-code" name="pairing-code" type="text" autoComplete="off" placeholder="M7RQ-8K4P" />
                <button type="submit">Conferma</button>
              </div>
              {pairingConfirmed && <small className="limited-pairing-success">Abbinamento confermato</small>}
              {pairingError && <small className="limited-pairing-error">Codice non corrispondente</small>}
            </form>
          )}

          {showDetails && <LimitedLinks />}

          {demo && <p className="limited-demo-note">Demo UI · dati generati localmente.</p>}
          {!demo && (
            <p className="limited-nfc-note">
              Un tag NFC può essere clonato. Controlla visivamente l&apos;elemento e verifica che il contesto sia coerente.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
