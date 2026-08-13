import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { LimitedVerificationExperience } from "../components/limited/LimitedVerificationExperience";
import type { LimitedVerificationData } from "../components/limited/limited-types";

const RANDOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const DEMO_TOTAL = 200;

export interface LimitedDemoData extends Required<LimitedVerificationData> {
  editionCode: string;
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
    imageSrc: "/media/spazio-ragazzi.jpg",
    imageAlt: "Fotografia demo ABBO APS",
  };
}

export function LimitedDemo() {
  const [demo] = useState(() => createLimitedDemoData());
  const [state, setState] = useState<"loading" | "verified">("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => setState("verified"), 1_120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Demo verifica edizione limitata — ABBO APS</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      <LimitedVerificationExperience {...demo} demo state={state} />
    </>
  );
}
