export function VerificationStamp({ visible, text = "VERIFICATO" }: { visible: boolean; text?: string }) {
  return (
    <span className={`limited-stamp ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
      {text}
    </span>
  );
}
