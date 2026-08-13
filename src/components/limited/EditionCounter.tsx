import { useEffect, useState, type CSSProperties } from "react";

export function formatEditionNumber(value: number, total: number): string {
  const width = Math.max(String(total).length, String(value).length, 1);
  return String(value).padStart(width, "0");
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

interface EditionCounterProps {
  current?: number;
  total?: number;
  revealed: boolean;
}

export function EditionCounter({ current, total, revealed }: EditionCounterProps) {
  const reducedMotion = useReducedMotion();

  if (!current || !total) {
    return (
      <div className="limited-counter limited-counter-empty" aria-label="Numero esemplare in attesa">
        <span aria-hidden="true">—</span>
      </div>
    );
  }

  const digits = formatEditionNumber(current, total).split("");
  const label = `Esemplare numero ${current} di ${total}`;

  return (
    <div className="limited-counter-wrap">
      <span className="limited-counter-label">Il tuo esemplare</span>
      <div className={`limited-counter ${revealed ? "is-revealed" : ""} ${reducedMotion ? "is-reduced" : ""}`}>
        <span className="sr-only">{label}</span>
        <span className="limited-counter-visual" aria-hidden="true">
          {digits.map((digit, index) => (
            <span
              className="limited-digit"
              key={`${index}-${digit}`}
              style={{ "--digit-delay": `${index * 70}ms`, "--digit-value": digit } as CSSProperties}
            >
              <span className="limited-digit-strip">
                {Array.from({ length: 10 }, (_, number) => <span key={number}>{number}</span>)}
              </span>
            </span>
          ))}
        </span>
        <span className="limited-counter-total">/ {total}</span>
      </div>
    </div>
  );
}
