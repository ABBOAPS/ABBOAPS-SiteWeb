import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CopyableValueProps = {
  value: string;
  copyLabel: string;
  actionLabel?: string;
  copiedLabel?: string;
  className?: string;
  valueClassName?: string;
};

export function CopyableValue({
  value,
  copyLabel,
  actionLabel,
  copiedLabel = "Copiato",
  className = "",
  valueClassName = "",
}: CopyableValueProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const fallbackCopy = () => {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  };

  const copyValue = async () => {
    let copied = false;

    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(value);
      copied = true;
    } catch {
      copied = fallbackCopy();
    }

    setCopied(copied);
    if (!copied) return;
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`inline-flex min-w-0 ${className}`}>
      <button
        type="button"
        onClick={copyValue}
        aria-label={copyLabel}
        className="inline-flex min-h-11 min-w-11 items-center gap-1.5 rounded-md px-1 text-left font-mono font-bold text-[#4a1c0d] transition-colors hover:text-[#e65100] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e65100]"
      >
        <span className={`min-w-0 break-words ${valueClassName}`}>{value}</span>
        {copied ? <Check className="size-4 shrink-0 text-[#e65100]" strokeWidth={2.5} aria-hidden="true" /> : <Copy className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />}
        {actionLabel && <span className="font-sans text-xs font-extrabold uppercase tracking-wider">{copied ? copiedLabel : actionLabel}</span>}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? copiedLabel : ""}</span>
    </div>
  );
}
