export function NfcHandoffIndicator({ received = true }: { received?: boolean }) {
  const copy = received ? "TAG LETTO" : "LINK NECESSARIO";
  return (
    <div className="limited-handoff" aria-label={received ? "Tag NFC letto" : "Link NFC necessario"}>
      <svg className="limited-nfc-mark" viewBox="0 0 72 42" aria-hidden="true">
        <path d="M8 31c8-8 8-12 0-20" />
        <path d="M24 35c11-11 11-17 0-28" />
        <path d="M42 38c14-14 14-22 0-34" />
        <circle cx="61" cy="21" r="3" />
      </svg>
      <span className="limited-handoff-copy">
        <span className="limited-handoff-kicker">NFC ·</span>
        <span>{copy}</span>
      </span>
    </div>
  );
}
