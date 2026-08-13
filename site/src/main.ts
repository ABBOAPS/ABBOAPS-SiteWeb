import './styles/main.css';
import { verifyEditionManifest } from './verifier/edition-verifier';
import { fetchKeyring, verifyItemToken } from './verifier/item-verifier';
import { parseNfcToken } from './verifier/token-parser';
import { buildLegacyVerificationRedirectUrl, readVerificationTokenFromHash } from './verifier/verification-url';
import { removeUrlFragment, renderUi, stateFromVerificationError, UiState } from './ui/render';
import { encodeUtf8, uint8ArrayToBase64Url } from './crypto/base64url';
import { sha256Bytes } from './crypto/web-crypto';

async function initApp(): Promise<void> {
  const container = document.getElementById('app');
  if (!container) return;

  const baseUrl = new URL(import.meta.env.BASE_URL || './', document.baseURI).toString();
  const hashFragment = window.location.hash;
  const tokenFromHash = readVerificationTokenFromHash(hashFragment);

  const legacyRedirectUrl = buildLegacyVerificationRedirectUrl(hashFragment);
  if (legacyRedirectUrl) {
    window.location.replace(legacyRedirectUrl);
    return;
  }

  if (!tokenFromHash) {
    renderUi({ container, state: 'TOKEN_MISSING' });
    return;
  }

  renderUi({ container, state: 'LOADING' });

  try {
    const parsedToken = parseNfcToken(tokenFromHash);
    removeUrlFragment();

    const keyring = await fetchKeyring(baseUrl);
    const itemVerification = await verifyItemToken(parsedToken, keyring);

    if (itemVerification.keyStatus === 'compromised') {
      renderUi({ container, state: 'KEY_COMPROMISED' });
      return;
    }

    const editionVerification = await verifyEditionManifest(itemVerification.payload, keyring, baseUrl);

    const initialState: UiState = itemVerification.keyStatus === 'retired'
      ? 'VERIFIED_KEY_RETIRED'
      : 'VERIFIED';

    let pairingConfirmed = false;
    let pairingError = false;

    const handlePairingSubmit = async (code: string) => {
      if (!itemVerification.payload.p) return;
      try {
        const editionId = itemVerification.payload.e;
        const itemId = itemVerification.payload.i;
        const inputString = `${editionId}:${itemId}:${code.trim()}`;
        const inputHashBytes = await sha256Bytes(encodeUtf8(inputString));
        const inputHashB64 = uint8ArrayToBase64Url(inputHashBytes);

        if (inputHashB64 === itemVerification.payload.p) {
          pairingConfirmed = true;
          pairingError = false;
        } else {
          pairingConfirmed = false;
          pairingError = true;
        }
      } catch (err) {
        pairingError = true;
      }
      renderCurrentState();
    };

    const renderCurrentState = () => {
      renderUi({
        container,
        state: initialState,
        itemPayload: itemVerification.payload,
        editionPayload: editionVerification.editionPayload,
        verifiedImageBlobUrl: editionVerification.verifiedImageBlobUrl,
        onPhysicalPairingSubmit: itemVerification.payload.p ? handlePairingSubmit : undefined,
        pairingConfirmed,
        pairingError,
      });
    };

    renderCurrentState();

  } catch (error: unknown) {
    const state: UiState = stateFromVerificationError(error);
    renderUi({ container, state });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
