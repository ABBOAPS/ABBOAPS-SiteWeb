import { EditionPayload } from '../verifier/edition-verifier';
import { ProductItemPayload } from '../verifier/item-verifier';

export type UiState =
  | 'TOKEN_MISSING'
  | 'LOADING'
  | 'VERIFIED'
  | 'VERIFIED_KEY_RETIRED'
  | 'KEY_COMPROMISED'
  | 'MANIFEST_KEY_COMPROMISED'
  | 'SIGNATURE_INVALID'
  | 'MANIFEST_MISSING'
  | 'MANIFEST_SIGNATURE_INVALID'
  | 'MANIFEST_HASH_MISMATCH'
  | 'IMAGE_INVALID'
  | 'KEY_UNKNOWN'
  | 'TOKEN_MALFORMED'
  | 'HOST_MISMATCH'
  | 'NETWORK_ERROR';

export interface RenderOptions {
  container: HTMLElement;
  state: UiState;
  itemPayload?: ProductItemPayload;
  editionPayload?: EditionPayload;
  verifiedImageBlobUrl?: string;
  errorMessage?: string;
  onPhysicalPairingSubmit?: (code: string) => void;
  pairingConfirmed?: boolean;
  pairingError?: boolean;
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tagName);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

export function renderUi(options: RenderOptions): void {
  const { container, state, itemPayload, editionPayload, verifiedImageBlobUrl, errorMessage, onPhysicalPairingSubmit, pairingConfirmed, pairingError } = options;

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const wrapper = createElement('div', 'verifier-card');

  const header = createElement('header', 'card-header');
  const logoBox = createElement('div', 'logo-container');
  const logoText = createElement('h1', 'brand-title', 'ABBO APS');
  const subtitle = createElement('p', 'brand-subtitle', 'Sistema di Verifica Prodotti NFC');
  logoBox.appendChild(logoText);
  logoBox.appendChild(subtitle);
  header.appendChild(logoBox);
  wrapper.appendChild(header);

  const contentSection = createElement('main', 'card-body');

  switch (state) {
    case 'TOKEN_MISSING': {
      const icon = createElement('div', 'status-icon status-icon-neutral', '📱');
      const title = createElement('h2', 'status-title', 'Nessun Codice Rilevato');
      const text = createElement('p', 'status-desc', 'Avvicina il tuo smartphone a un prodotto fisico ABBO APS dotato di tag NFC per verificarne il codice digitale.');
      contentSection.appendChild(icon);
      contentSection.appendChild(title);
      contentSection.appendChild(text);
      break;
    }

    case 'LOADING': {
      const icon = createElement('div', 'status-icon spinner', '⏳');
      const title = createElement('h2', 'status-title', 'Verifica Crittografica in Corso...');
      const text = createElement('p', 'status-desc', 'Controllo della firma ECDSA P-256 e dei dati pubblici dell\'edizione.');
      contentSection.appendChild(icon);
      contentSection.appendChild(title);
      contentSection.appendChild(text);
      break;
    }

    case 'VERIFIED':
    case 'VERIFIED_KEY_RETIRED': {
      if (!itemPayload || !editionPayload) break;

      const isRetired = state === 'VERIFIED_KEY_RETIRED';

      const badge = createElement(
        'div',
        isRetired ? 'badge badge-warning' : 'badge badge-success',
        isRetired ? '✓ Codice Digitale Verificato (Chiave Storica Retired)' : '✓ Codice digitale ABBO APS verificato'
      );
      contentSection.appendChild(badge);

      // Rendering immagine verificata se disponibile
      if (verifiedImageBlobUrl) {
        const imgBox = createElement('div', 'product-image-container');
        const img = document.createElement('img');
        img.src = verifiedImageBlobUrl;
        img.alt = editionPayload.image.alt || editionPayload.title;
        img.className = 'product-verified-image';
        imgBox.appendChild(img);
        contentSection.appendChild(imgBox);
      }

      const edTitle = createElement('h2', 'product-title', editionPayload.title);
      contentSection.appendChild(edTitle);

      const serialBox = createElement('div', 'serial-box');
      const serialLabel = createElement('span', 'serial-label', 'Numero Esemplare');
      const serialValue = createElement('span', 'serial-value', `Esemplare ${itemPayload.s} di ${itemPayload.n}`);
      serialBox.appendChild(serialLabel);
      serialBox.appendChild(serialValue);
      contentSection.appendChild(serialBox);

      if (editionPayload.description) {
        const desc = createElement('p', 'product-desc', editionPayload.description);
        contentSection.appendChild(desc);
      }

      const metaGrid = createElement('div', 'meta-grid');
      const codeItem = createElement('div', 'meta-item');
      codeItem.appendChild(createElement('span', 'meta-label', 'Codice Edizione'));
      codeItem.appendChild(createElement('span', 'meta-value', editionPayload.code));
      metaGrid.appendChild(codeItem);

      const dateItem = createElement('div', 'meta-item');
      dateItem.appendChild(createElement('span', 'meta-label', 'Data Emissione'));
      dateItem.appendChild(createElement('span', 'meta-value', itemPayload.d));
      metaGrid.appendChild(dateItem);
      contentSection.appendChild(metaGrid);

      const physicalReminder = createElement('div', 'alert-box alert-info');
      const remTitle = createElement('strong', 'alert-title', '💡 Controllo Consigliato:');
      const remText = createElement('p', 'alert-text', `Confronta il numero digitale (${itemPayload.s} / ${itemPayload.n}) con quello stampato, inciso o ricamato sul prodotto fisico.`);
      physicalReminder.appendChild(remTitle);
      physicalReminder.appendChild(remText);
      contentSection.appendChild(physicalReminder);

      if (itemPayload.p && onPhysicalPairingSubmit) {
        const pairingCard = createElement('div', 'pairing-card');
        const pTitle = createElement('h3', 'pairing-title', 'Codice Fisico di Abbinamento');
        const pDesc = createElement('p', 'pairing-desc', 'Inserisci il codice stampato sul certificato o sul retro del prodotto per confermare l\'abbinamento.');
        pairingCard.appendChild(pTitle);
        pairingCard.appendChild(pDesc);

        if (pairingConfirmed) {
          const successBadge = createElement('div', 'badge badge-success', '✓ Abbinamento Fisico Confermato');
          pairingCard.appendChild(successBadge);
        } else {
          const form = createElement('form', 'pairing-form');
          const input = document.createElement('input');
          input.type = 'text';
          input.placeholder = 'es. M7RQ-8K4P-2TXD';
          input.className = 'pairing-input';

          const button = createElement('button', 'btn btn-primary', 'Verifica Codice');
          button.type = 'submit';

          form.onsubmit = (e) => {
            e.preventDefault();
            if (input.value.trim()) {
              onPhysicalPairingSubmit(input.value.trim());
            }
          };

          form.appendChild(input);
          form.appendChild(button);
          pairingCard.appendChild(form);

          if (pairingError) {
            const errText = createElement('p', 'text-danger', '❌ Codice di abbinamento non corrispondente.');
            pairingCard.appendChild(errText);
          }
        }
        contentSection.appendChild(pairingCard);
      }

      const infoBox = createElement('details', 'info-details');
      const summary = createElement('summary', 'info-summary', 'Cosa significa questa verifica?');
      const infoText = createElement('p', 'info-text', 'La firma crittografica ECDSA P-256 garantisce che i dati dell\'esemplare e dell\'edizione sono stati generati da ABBO APS e non sono stati alterati. I tag NFC standard possono essere duplicati bit-per-bit: verifica la corrispondenza del seriale fisico.');
      infoBox.appendChild(summary);
      infoBox.appendChild(infoText);
      contentSection.appendChild(infoBox);

      break;
    }

    case 'IMAGE_INVALID': {
      const icon = createElement('div', 'status-icon status-icon-danger', '🖼️');
      const title = createElement('h2', 'status-title text-danger', 'Immagine Non Autentica');
      const text = createElement('p', 'status-desc', 'L\'immagine dell\'edizione non risponde all\'hash SHA-256 autenticato firmato nel manifesto.');
      contentSection.appendChild(icon);
      contentSection.appendChild(title);
      contentSection.appendChild(text);
      break;
    }

    case 'KEY_COMPROMISED': {
      const badge = createElement('div', 'badge badge-danger', '⚠️ CHIAVE PRIVATA COMPROMESSA');
      const title = createElement('h2', 'status-title text-danger', 'Avviso di Incidente di Sicurezza');
      const text = createElement('p', 'status-desc', 'La chiave di firma utilizzata per questo token è stata contrassegnata come compromessa. Non considerare l\'autenticità digitale come valida e contatta immediatamente ABBO APS.');
      contentSection.appendChild(badge);
      contentSection.appendChild(title);
      contentSection.appendChild(text);
      break;
    }

    case 'MANIFEST_KEY_COMPROMISED': {
      const badge = createElement('div', 'badge badge-danger', '⚠️ CHIAVE MANIFESTO COMPROMESSA');
      const title = createElement('h2', 'status-title text-danger', 'Avviso di Incidente di Sicurezza');
      const text = createElement('p', 'status-desc', 'La chiave usata per firmare il manifesto dell’edizione è stata contrassegnata come compromessa. Non considerare questa verifica come valida e contatta ABBO APS.');
      contentSection.appendChild(badge);
      contentSection.appendChild(title);
      contentSection.appendChild(text);
      break;
    }

    case 'SIGNATURE_INVALID': {
      const icon = createElement('div', 'status-icon status-icon-danger', '❌');
      const title = createElement('h2', 'status-title text-danger', 'Codice Non Valido');
      const text = createElement('p', 'status-desc', 'La firma crittografica del token non corrisponde. I dati potrebbero essere stati modificati o la firma non è stata generata da ABBO APS.');
      contentSection.appendChild(icon);
      contentSection.appendChild(title);
      contentSection.appendChild(text);
      break;
    }

    case 'MANIFEST_MISSING':
    case 'MANIFEST_SIGNATURE_INVALID':
    case 'MANIFEST_HASH_MISMATCH': {
      const icon = createElement('div', 'status-icon status-icon-danger', '⚠️');
      const title = createElement('h2', 'status-title text-danger', 'Errore Dati Edizione');
      const text = createElement('p', 'status-desc', errorMessage || 'Impossibile verificare l\'integrità del manifesto dell\'edizione pubblica.');
      contentSection.appendChild(icon);
      contentSection.appendChild(title);
      contentSection.appendChild(text);
      break;
    }

    case 'KEY_UNKNOWN': {
      const icon = createElement('div', 'status-icon status-icon-danger', '❓');
      const title = createElement('h2', 'status-title', 'Chiave Pubblica Sconosciuta');
      const text = createElement('p', 'status-desc', 'Impossibile verificare il codice con le chiavi pubbliche attualmente presenti nel keyring ABBO APS.');
      contentSection.appendChild(icon);
      contentSection.appendChild(title);
      contentSection.appendChild(text);
      break;
    }

    case 'TOKEN_MALFORMED': {
      const icon = createElement('div', 'status-icon status-icon-danger', '🚫');
      const title = createElement('h2', 'status-title', 'Formato Token Non Valido');
      const text = createElement('p', 'status-desc', 'Il codice letto dal tag NFC non rispetta la struttura del protocollo AB1.');
      contentSection.appendChild(icon);
      contentSection.appendChild(title);
      contentSection.appendChild(text);
      break;
    }

    case 'HOST_MISMATCH': {
      const icon = createElement('div', 'status-icon status-icon-danger', '🛑');
      const title = createElement('h2', 'status-title text-danger', 'Host Non Autorizzato');
      const text = createElement('p', 'status-desc', 'Questa copia del verificatore non è ospitata su un dominio ufficiale o autorizzato ABBO APS.');
      contentSection.appendChild(icon);
      contentSection.appendChild(title);
      contentSection.appendChild(text);
      break;
    }

    case 'NETWORK_ERROR':
    default: {
      const icon = createElement('div', 'status-icon status-icon-danger', '⚡');
      const title = createElement('h2', 'status-title', 'Errore di Rete o Tecnico');
      const text = createElement('p', 'status-desc', errorMessage || 'Si è verificato un errore durante la connessione con il verificatore statico.');
      contentSection.appendChild(icon);
      contentSection.appendChild(title);
      contentSection.appendChild(text);
      break;
    }
  }

  wrapper.appendChild(contentSection);

  const footer = createElement('footer', 'card-footer');
  const link = document.createElement('a');
  link.href = 'https://www.abboaps.org';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'official-link';
  link.textContent = '🌐 Sito Ufficiale ABBO APS (www.abboaps.org)';
  footer.appendChild(link);
  wrapper.appendChild(footer);

  container.appendChild(wrapper);
}

export function removeUrlFragment(): void {
  if (window.location.hash) {
    history.replaceState(null, document.title, window.location.pathname + window.location.search);
  }
}
