import './styles/main.css';
import { verifyEditionManifest } from './verifier/edition-verifier';
import { fetchKeyring, verifyItemToken } from './verifier/item-verifier';
import { parseNfcToken } from './verifier/token-parser';
import { removeUrlFragment, renderUi, UiState } from './ui/render';
import { encodeUtf8, uint8ArrayToBase64Url } from './crypto/base64url';
import { sha256Bytes } from './crypto/web-crypto';

async function initApp(): Promise<void> {
  const container = document.getElementById('app');
  if (!container) return;

  const baseUrl = import.meta.env.BASE_URL || '/nfc/';
  const hashFragment = window.location.hash;

  if (!hashFragment || hashFragment === '#' || hashFragment === '') {
    renderUi({ container, state: 'TOKEN_MISSING' });
    return;
  }

  renderUi({ container, state: 'LOADING' });

  try {
    const parsedToken = parseNfcToken(hashFragment);
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

  } catch (error: any) {
    console.error('Errore di verifica NFC:', error);
    const msg = error?.message || 'UNKNOWN_ERROR';

    let state: UiState = 'NETWORK_ERROR';
    if (msg === 'TOKEN_MALFORMED_SEGMENTS' || msg === 'TOKEN_UNSUPPORTED_VERSION' || msg === 'TOKEN_INVALID_KID') {
      state = 'TOKEN_MALFORMED';
    } else if (msg === 'SIGNATURE_INVALID' || msg === 'SIGNATURE_INVALID_LENGTH') {
      state = 'SIGNATURE_INVALID';
    } else if (msg === 'KEY_UNKNOWN') {
      state = 'KEY_UNKNOWN';
    } else if (msg === 'MANIFEST_NOT_FOUND') {
      state = 'MANIFEST_MISSING';
    } else if (msg === 'MANIFEST_SIGNATURE_INVALID') {
      state = 'MANIFEST_SIGNATURE_INVALID';
    } else if (msg === 'MANIFEST_HASH_MISMATCH') {
      state = 'MANIFEST_HASH_MISMATCH';
    } else if (msg === 'IMAGE_INVALID' || msg === 'IMAGE_INVALID_HASH') {
      state = 'IMAGE_INVALID';
    }

    renderUi({ container, state, errorMessage: msg });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
