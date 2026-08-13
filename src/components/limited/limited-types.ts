export type LimitedVerificationState =
  | "loading"
  | "verified"
  | "invalid"
  | "compromised"
  | "technical"
  | "missing";

export interface LimitedVerificationData {
  title?: string;
  editionCode?: string;
  serial?: number;
  total?: number;
  imageSrc?: string;
  imageAlt?: string;
}
