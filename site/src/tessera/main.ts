import '../styles/tessera.css';
import { readAndRemoveCardToken } from './token-parser';
import { verifyMembershipToken, TesseraApiResponse } from './api-client';
import { fetchAndValidateTesseraLinks, TesseraLinkItem } from './link-tree';
import { renderTesseraUi, UiRenderState } from './render';

async function initTesseraApp(): Promise<void> {
  const container = document.getElementById('app');
  if (!container) return;

  const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.BASE_URL : undefined) || '/';
  const logoPath = '/assets/logo_abbo_nero.svg';

  // Carica i link utili in background
  const linksPromise: Promise<TesseraLinkItem[]> = fetchAndValidateTesseraLinks(baseUrl);

  // 1. Leggi il token e rimuovi IMMEDIATAMENTE il frammento dall'URL del browser
  const { token, error } = readAndRemoveCardToken();
  const links = await linksPromise;

  if (error || !token) {
    const fallbackState: UiRenderState = error === 'TOKEN_MALFORMED' ? 'TOKEN_MALFORMED' : 'TOKEN_MISSING';
    renderTesseraUi({
      container,
      state: fallbackState,
      links,
      logoPath,
    });
    return;
  }

  // 2. Mostra lo stato di caricamento
  renderTesseraUi({
    container,
    state: 'LOADING',
    links,
    logoPath,
  });

  let memoryToken: string | null = token;
  let apiResponse: TesseraApiResponse;

  try {
    // 3. Esegui la chiamata HTTPS POST all'API del gestionale con timeout
    apiResponse = await verifyMembershipToken(memoryToken);
  } catch {
    apiResponse = { result: 'unavailable' };
  } finally {
    // 4. Azzera immediatamente il riferimento al token in memoria
    memoryToken = null;
  }

  // 5. Renderizza il risultato finale
  const targetState: UiRenderState = apiResponse.result;
  renderTesseraUi({
    container,
    state: targetState,
    apiData: apiResponse,
    links,
    logoPath,
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTesseraApp();
});
