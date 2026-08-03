import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { encodeUtf8, uint8ArrayToBase64Url } from "../../site/src/crypto/base64url";
import { sha256Bytes } from "../../site/src/crypto/web-crypto";
import { verifyEditionManifest } from "../../site/src/verifier/edition-verifier";
import { fetchKeyring, verifyItemToken } from "../../site/src/verifier/item-verifier";
import { parseNfcToken } from "../../site/src/verifier/token-parser";
import { renderUi, stateFromVerificationError, UiState } from "../../site/src/ui/render";
import { buildLimitedVerificationCleanUrl } from "../../site/src/verifier/verification-url";

import "../styles/limited-verification.css";

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

export function LimitedVerification({ token }: { token?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const routeToken = token;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    if (!routeToken) {
      renderUi({ container, state: "TOKEN_MISSING" });
      return () => container.replaceChildren();
    }

    // Acquisizione in memoria prima della sostituzione della cronologia.
    let tokenInMemory: string | undefined = routeToken;
    removeLimitedTokenFromAddressBar();
    renderUi({ container, state: "LOADING" });

    let disposed = false;
    let verifiedImageBlobUrl: string | undefined;

    const verify = async (): Promise<void> => {
      try {
        const parsedToken = parseNfcToken(tokenInMemory ?? "");
        tokenInMemory = undefined;

        const keyring = await fetchKeyring(getVerifierBaseUrl());
        const itemVerification = await verifyItemToken(parsedToken, keyring);

        if (itemVerification.keyStatus === "compromised") {
          if (!disposed) renderUi({ container, state: "KEY_COMPROMISED" });
          return;
        }

        const editionVerification = await verifyEditionManifest(
          itemVerification.payload,
          keyring,
          getVerifierBaseUrl(),
        );
        verifiedImageBlobUrl = editionVerification.verifiedImageBlobUrl;

        const initialState: UiState = itemVerification.keyStatus === "retired"
          ? "VERIFIED_KEY_RETIRED"
          : "VERIFIED";
        let pairingConfirmed = false;
        let pairingError = false;

        const renderCurrentState = () => {
          if (disposed) return;
          renderUi({
            container,
            state: initialState,
            itemPayload: itemVerification.payload,
            editionPayload: editionVerification.editionPayload,
            verifiedImageBlobUrl,
            onPhysicalPairingSubmit: itemVerification.payload.p
              ? async (code: string) => {
                  try {
                    const input = `${itemVerification.payload.e}:${itemVerification.payload.i}:${code.trim()}`;
                    const inputHash = uint8ArrayToBase64Url(await sha256Bytes(encodeUtf8(input)));
                    pairingConfirmed = inputHash === itemVerification.payload.p;
                    pairingError = !pairingConfirmed;
                  } catch {
                    pairingConfirmed = false;
                    pairingError = true;
                  }
                  renderCurrentState();
                }
              : undefined,
            pairingConfirmed,
            pairingError,
          });
        };

        renderCurrentState();
      } catch (error: unknown) {
        tokenInMemory = undefined;
        if (!disposed) renderUi({ container, state: stateFromVerificationError(error) });
      }
    };

    void verify();

    return () => {
      disposed = true;
      tokenInMemory = undefined;
      if (verifiedImageBlobUrl) URL.revokeObjectURL(verifiedImageBlobUrl);
      container.replaceChildren();
    };
  }, [routeToken]);

  return (
    <>
      <Helmet>
        <title>Verifica edizione limitata — ABBO APS</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      <div className="limited-verification-page">
        <div ref={containerRef} aria-live="polite" />
      </div>
    </>
  );
}

export function LimitedVerificationRoute() {
  const { token } = useParams<{ token: string }>();
  return <LimitedVerification token={token} />;
}
