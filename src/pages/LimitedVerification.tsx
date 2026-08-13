import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { encodeUtf8, uint8ArrayToBase64Url } from "../../site/src/crypto/base64url";
import { sha256Bytes } from "../../site/src/crypto/web-crypto";
import { verifyEditionManifest } from "../../site/src/verifier/edition-verifier";
import { fetchKeyring, verifyItemToken } from "../../site/src/verifier/item-verifier";
import { parseNfcToken } from "../../site/src/verifier/token-parser";
import { buildLimitedVerificationCleanUrl } from "../../site/src/verifier/verification-url";
import { stateFromVerificationError } from "../../site/src/ui/render";
import { LimitedVerificationExperience } from "../components/limited/LimitedVerificationExperience";
import type { LimitedVerificationState } from "../components/limited/limited-types";

function getVerifierBaseUrl(): string {
  const appBaseUrl = new URL(import.meta.env.BASE_URL, document.baseURI);
  return new URL("nfc/", appBaseUrl).toString();
}

function removeLimitedTokenFromAddressBar(): void {
  window.history.replaceState(
    null,
    document.title,
    buildLimitedVerificationCleanUrl(window.location.pathname, window.location.search),
  );
}

function toLimitedState(error: unknown): LimitedVerificationState {
  const state = stateFromVerificationError(error);
  if (state === "MANIFEST_KEY_COMPROMISED" || state === "KEY_COMPROMISED") return "compromised";
  if (state === "NETWORK_ERROR" || state === "TECHNICAL_ERROR" || state === "MANIFEST_MISSING") return "technical";
  return "invalid";
}

export function LimitedVerification({ token }: { token?: string }) {
  const [state, setState] = useState<LimitedVerificationState>(token ? "loading" : "missing");
  const [item, setItem] = useState<{ title: string; editionCode: string; serial: number; total: number; imageSrc?: string; imageAlt?: string }>();
  const [pairingConfirmed, setPairingConfirmed] = useState(false);
  const [pairingError, setPairingError] = useState(false);
  const tokenInMemory = useRef<string | undefined>(undefined);
  const pairingHash = useRef<string | undefined>(undefined);
  const pairingEditionId = useRef<string | undefined>(undefined);
  const pairingItemId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!token) {
      setState("missing");
      return undefined;
    }

    // Conserva token solo in memoria, poi rimuovilo dalla barra degli indirizzi.
    tokenInMemory.current = token;
    removeLimitedTokenFromAddressBar();

    let disposed = false;
    let verifiedImageBlobUrl: string | undefined;

    const verify = async () => {
      try {
        const parsedToken = parseNfcToken(tokenInMemory.current ?? "");
        tokenInMemory.current = undefined;

        const baseUrl = getVerifierBaseUrl();
        const keyring = await fetchKeyring(baseUrl);
        const itemVerification = await verifyItemToken(parsedToken, keyring);

        if (itemVerification.keyStatus === "compromised") {
          if (!disposed) setState("compromised");
          return;
        }

        const editionVerification = await verifyEditionManifest(itemVerification.payload, keyring, baseUrl);
        verifiedImageBlobUrl = editionVerification.verifiedImageBlobUrl;
        pairingHash.current = itemVerification.payload.p;
        pairingEditionId.current = itemVerification.payload.e;
        pairingItemId.current = itemVerification.payload.i;
        if (disposed) return;

        setItem({
          title: editionVerification.editionPayload.title,
          editionCode: editionVerification.editionPayload.code,
          serial: itemVerification.payload.s,
          total: itemVerification.payload.n,
          imageSrc: verifiedImageBlobUrl,
          imageAlt: editionVerification.editionPayload.image.alt,
        });
        setState("verified");
      } catch (error: unknown) {
        tokenInMemory.current = undefined;
        if (!disposed) setState(toLimitedState(error));
      }
    };

    void verify();

    return () => {
      disposed = true;
      tokenInMemory.current = undefined;
      pairingHash.current = undefined;
      pairingEditionId.current = undefined;
      pairingItemId.current = undefined;
      if (verifiedImageBlobUrl) URL.revokeObjectURL(verifiedImageBlobUrl);
    };
  }, [token]);

  const handlePairingSubmit = async (code: string) => {
    if (!item || !pairingHash.current || !pairingEditionId.current || !pairingItemId.current) return;
    try {
      const input = `${pairingEditionId.current}:${pairingItemId.current}:${code.trim()}`;
      const inputHash = uint8ArrayToBase64Url(await sha256Bytes(encodeUtf8(input)));
      const matches = inputHash === pairingHash.current;
      setPairingConfirmed(matches);
      setPairingError(!matches);
    } catch {
      setPairingConfirmed(false);
      setPairingError(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verifica edizione limitata — ABBO APS</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      <LimitedVerificationExperience
        {...item}
        state={state}
        pairingEnabled={Boolean(pairingHash.current)}
        pairingConfirmed={pairingConfirmed}
        pairingError={pairingError}
        onPhysicalPairingSubmit={handlePairingSubmit}
      />
    </>
  );
}

export function LimitedVerificationRoute() {
  const { token } = useParams<{ token: string }>();
  return <LimitedVerification token={token} />;
}
