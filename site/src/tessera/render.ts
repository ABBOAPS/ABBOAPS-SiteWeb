/**
 * Rendering sicuro del DOM con il Design System Claymorphic 3D di ABBO APS.
 * Utilizza ESCLUSIVAMENTE textContent ed elementi semantici creati via document.createElement.
 */

import { TesseraApiResponse } from './api-client';
import { TesseraLinkItem } from './link-tree';

export type UiRenderState =
  | 'LOADING'
  | 'active'
  | 'membership_inactive'
  | 'suspended'
  | 'not_valid'
  | 'unavailable'
  | 'TOKEN_MISSING'
  | 'TOKEN_MALFORMED';

export interface RenderOptions {
  container: HTMLElement;
  state: UiRenderState;
  apiData?: TesseraApiResponse;
  links?: TesseraLinkItem[];
  logoPath?: string;
}

export function formatItalianDate(isoDateStr?: string): string | null {
  if (!isoDateStr || typeof isoDateStr !== 'string') return null;
  const match = isoDateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return isoDateStr;

  const year = match[1];
  const monthIndex = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);

  const mesi = [
    'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
    'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
  ];

  if (monthIndex < 0 || monthIndex >= 12) return isoDateStr;
  return `${day} ${mesi[monthIndex]} ${year}`;
}

export function renderTesseraUi(options: RenderOptions): void {
  const { container, state, apiData, links = [], logoPath = '/assets/logo_abbo_nero.svg' } = options;

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const pageWrapper = document.createElement('div');
  pageWrapper.className = 'tessera-page-wrapper';

  const bgDecor = document.createElement('div');
  bgDecor.className = 'tessera-bg-decor';
  bgDecor.setAttribute('aria-hidden', 'true');
  pageWrapper.appendChild(bgDecor);

  const mainCard = document.createElement('article');
  mainCard.className = `tessera-card state-${state}`;

  const liveRegion = document.createElement('div');
  liveRegion.className = 'sr-only';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'status');

  // Logotipo ABBO APS
  const logoContainer = document.createElement('div');
  logoContainer.className = 'tessera-logo-container';
  const logoImg = document.createElement('img');
  logoImg.src = logoPath;
  logoImg.alt = 'Logo ABBO APS';
  logoImg.className = 'tessera-logo';
  logoContainer.appendChild(logoImg);
  mainCard.appendChild(logoContainer);

  const contentArea = document.createElement('div');
  contentArea.className = 'tessera-content-area';

  switch (state) {
    case 'LOADING': {
      liveRegion.textContent = 'Verifica della tessera associativa in corso...';

      const spinner = document.createElement('div');
      spinner.className = 'tessera-spinner';
      spinner.setAttribute('aria-hidden', 'true');
      contentArea.appendChild(spinner);

      const title = document.createElement('h1');
      title.className = 'tessera-title-loading';
      title.textContent = 'Verifica in corso...';
      contentArea.appendChild(title);
      break;
    }

    case 'active': {
      liveRegion.textContent = 'Tessera verificata. Quota associativa in regola.';

      // Badge 3D Claymorphic
      const badge3D = document.createElement('div');
      badge3D.className = 'tessera-3d-clay-badge badge-3d-active';
      badge3D.setAttribute('aria-hidden', 'true');
      badge3D.textContent = '✓';
      contentArea.appendChild(badge3D);

      const nameEl = document.createElement('h1');
      nameEl.className = 'tessera-member-name';
      nameEl.textContent = apiData?.member?.displayName || 'Socio ABBO APS';
      contentArea.appendChild(nameEl);

      const roleBadge = document.createElement('p');
      roleBadge.className = 'tessera-member-subtitle';
      roleBadge.textContent = 'Socio ABBO APS';
      contentArea.appendChild(roleBadge);

      const statusPill = document.createElement('div');
      statusPill.className = 'tessera-status-pill pill-active';
      statusPill.textContent = 'Quota associativa in regola';
      contentArea.appendChild(statusPill);

      if (apiData?.membership?.validUntil) {
        const formattedDate = formatItalianDate(apiData.membership.validUntil);
        const validUntilEl = document.createElement('p');
        validUntilEl.className = 'tessera-validity-text';
        validUntilEl.textContent = `Valida fino al ${formattedDate}`;
        contentArea.appendChild(validUntilEl);
      }

      const cardCode = apiData?.card?.code || apiData?.card?.displayCode;
      if (cardCode) {
        const codeEl = document.createElement('p');
        codeEl.className = 'tessera-code-pill';
        codeEl.textContent = cardCode;
        contentArea.appendChild(codeEl);
      }

      const noteEl = document.createElement('p');
      noteEl.className = 'tessera-disclaimer-note';
      noteEl.textContent =
        'La verifica conferma la posizione associativa collegata alla tessera. Il partner può richiedere un documento d\'identità in caso di necessità.';
      contentArea.appendChild(noteEl);
      break;
    }

    case 'membership_inactive': {
      liveRegion.textContent = 'Tessera ABBO APS riconosciuta. Quota associativa non in regola.';

      const badge3D = document.createElement('div');
      badge3D.className = 'tessera-3d-clay-badge badge-3d-warning';
      badge3D.setAttribute('aria-hidden', 'true');
      badge3D.textContent = '!';
      contentArea.appendChild(badge3D);

      const titleEl = document.createElement('h1');
      titleEl.className = 'tessera-header-title';
      titleEl.textContent = 'Tessera ABBO APS riconosciuta';
      contentArea.appendChild(titleEl);

      const statusPill = document.createElement('div');
      statusPill.className = 'tessera-status-pill pill-warning';
      statusPill.textContent = 'Quota associativa non in regola';
      contentArea.appendChild(statusPill);

      if (apiData?.card?.displayCode) {
        const codeEl = document.createElement('p');
        codeEl.className = 'tessera-code-pill';
        codeEl.textContent = `Tessera ${apiData.card.displayCode}`;
        contentArea.appendChild(codeEl);
      }

      const descEl = document.createElement('p');
      descEl.className = 'tessera-desc-text';
      descEl.textContent = 'Rinnova o contatta ABBO APS per informazioni.';
      contentArea.appendChild(descEl);
      break;
    }

    case 'suspended': {
      liveRegion.textContent = 'Posizione associativa sospesa.';

      const badge3D = document.createElement('div');
      badge3D.className = 'tessera-3d-clay-badge badge-3d-warning';
      badge3D.setAttribute('aria-hidden', 'true');
      badge3D.textContent = '!';
      contentArea.appendChild(badge3D);

      const titleEl = document.createElement('h1');
      titleEl.className = 'tessera-header-title';
      titleEl.textContent = 'Posizione associativa sospesa';
      contentArea.appendChild(titleEl);

      const statusPill = document.createElement('div');
      statusPill.className = 'tessera-status-pill pill-warning';
      statusPill.textContent = 'Sospesa';
      contentArea.appendChild(statusPill);

      const descEl = document.createElement('p');
      descEl.className = 'tessera-desc-text';
      descEl.textContent = 'Per chiarimenti contatta l\'associazione ABBO APS.';
      contentArea.appendChild(descEl);
      break;
    }

    case 'not_valid': {
      liveRegion.textContent = 'Tessera non valida. Non è stato possibile verificare questa tessera.';

      const badge3D = document.createElement('div');
      badge3D.className = 'tessera-3d-clay-badge badge-3d-danger';
      badge3D.setAttribute('aria-hidden', 'true');
      badge3D.textContent = '✕';
      contentArea.appendChild(badge3D);

      const titleEl = document.createElement('h1');
      titleEl.className = 'tessera-header-title';
      titleEl.textContent = 'Tessera non valida';
      contentArea.appendChild(titleEl);

      const statusPill = document.createElement('div');
      statusPill.className = 'tessera-status-pill pill-danger';
      statusPill.textContent = 'Non valida';
      contentArea.appendChild(statusPill);

      const descEl = document.createElement('p');
      descEl.className = 'tessera-desc-text';
      descEl.textContent = 'Non è stato possibile verificare questa tessera.';
      contentArea.appendChild(descEl);
      break;
    }

    case 'unavailable': {
      liveRegion.textContent = 'Verifica momentaneamente non disponibile.';

      const badge3D = document.createElement('div');
      badge3D.className = 'tessera-3d-clay-badge badge-3d-neutral';
      badge3D.setAttribute('aria-hidden', 'true');
      badge3D.textContent = '⚡';
      contentArea.appendChild(badge3D);

      const titleEl = document.createElement('h1');
      titleEl.className = 'tessera-header-title';
      titleEl.textContent = 'Verifica momentaneamente non disponibile';
      contentArea.appendChild(titleEl);

      const statusPill = document.createElement('div');
      statusPill.className = 'tessera-status-pill pill-neutral';
      statusPill.textContent = 'Servizio temporaneamente non disponibile';
      contentArea.appendChild(statusPill);

      const descEl = document.createElement('p');
      descEl.className = 'tessera-desc-text';
      descEl.textContent = 'Controlla la connessione e riprova tra poco.';
      contentArea.appendChild(descEl);
      break;
    }

    case 'TOKEN_MISSING':
    case 'TOKEN_MALFORMED':
    default: {
      liveRegion.textContent = 'Verifica Tessera Associativa ABBO APS.';

      const badge3D = document.createElement('div');
      badge3D.className = 'tessera-3d-clay-badge badge-3d-active';
      badge3D.setAttribute('aria-hidden', 'true');
      badge3D.textContent = '💳';
      contentArea.appendChild(badge3D);

      const titleEl = document.createElement('h1');
      titleEl.className = 'tessera-header-title';
      titleEl.textContent = 'Tessera Associativa ABBO APS';
      contentArea.appendChild(titleEl);

      const descEl = document.createElement('p');
      descEl.className = 'tessera-desc-text';
      descEl.textContent =
        'Scansiona il tag NFC sulla tua tessera associativa per verificarne lo stato in tempo reale.';
      contentArea.appendChild(descEl);
      break;
    }
  }

  mainCard.appendChild(contentArea);
  pageWrapper.appendChild(liveRegion);
  pageWrapper.appendChild(mainCard);

  // Galleria Link Tree Claymorphism
  if (links && links.length > 0) {
    const gallerySection = document.createElement('nav');
    gallerySection.className = 'tessera-links-gallery';
    gallerySection.setAttribute('aria-label', 'Link utili ABBO APS');

    const linksGrid = document.createElement('div');
    linksGrid.className = 'tessera-links-grid';

    links.forEach((link) => {
      const a = document.createElement('a');
      a.className = 'tessera-link-card';
      a.href = link.url;
      if (link.url.startsWith('https:')) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }

      const iconBox = document.createElement('div');
      iconBox.className = `tessera-link-icon-3d icon-3d-${link.icon || 'globe'}`;
      iconBox.setAttribute('aria-hidden', 'true');
      appendLinkIcon(iconBox, link.icon);
      a.appendChild(iconBox);

      const textWrapper = document.createElement('div');
      textWrapper.className = 'tessera-link-text';

      const linkTitle = document.createElement('span');
      linkTitle.className = 'tessera-link-title';
      linkTitle.textContent = link.title;
      textWrapper.appendChild(linkTitle);

      if (link.subtitle) {
        const linkSub = document.createElement('span');
        linkSub.className = 'tessera-link-subtitle';
        linkSub.textContent = link.subtitle;
        textWrapper.appendChild(linkSub);
      }

      a.appendChild(textWrapper);
      linksGrid.appendChild(a);
    });

    gallerySection.appendChild(linksGrid);
    pageWrapper.appendChild(gallerySection);
  }

  // Legal Disclaimer & 3 mandatory legal links
  const disclaimerSection = document.createElement('section');
  disclaimerSection.className = 'tessera-disclaimer-card';
  disclaimerSection.setAttribute('aria-label', 'Informazioni sulla verifica');

  const discTitle = document.createElement('h4');
  discTitle.className = 'tessera-disclaimer-title';
  discTitle.textContent = 'ℹ️ Informazioni sulla verifica';
  disclaimerSection.appendChild(discTitle);

  const discP = document.createElement('p');
  discP.className = 'tessera-disclaimer-text';
  discP.textContent = 'Questa verifica conferma che il codice digitale presentato risulta associato a una Card ABBO APS e mostra lo stato restituito dal gestionale al momento della consultazione. I normali tag NFC possono essere copiati o clonati: l’esito non certifica da solo l’autenticità materiale della Card né l’identità del portatore. La Card è personale e non cedibile. In caso di dubbio può essere richiesto un documento di identità.';
  disclaimerSection.appendChild(discP);

  const discAlert = document.createElement('div');
  discAlert.className = 'tessera-disclaimer-alert';
  discAlert.textContent = '⚠️ In caso di smarrimento, furto o utilizzo sospetto, contatta tempestivamente ABBO APS per richiedere la revoca del token.';
  disclaimerSection.appendChild(discAlert);

  // Mandatory 3 Legal Links
  const legalLinksBox = document.createElement('div');
  legalLinksBox.className = 'tessera-legal-links';

  const link1 = document.createElement('a');
  link1.href = '/#/tessera/condizioni';
  link1.className = 'tessera-legal-link';
  link1.textContent = '📄 Condizioni d’uso della Card';
  legalLinksBox.appendChild(link1);

  const link2 = document.createElement('a');
  link2.href = '/#/tessera/privacy';
  link2.className = 'tessera-legal-link';
  link2.textContent = '🔒 Informativa privacy Card NFC';
  legalLinksBox.appendChild(link2);

  const link3 = document.createElement('a');
  link3.href = '/#/tessera/partner';
  link3.className = 'tessera-legal-link';
  link3.textContent = '🤝 Regole per i partner convenzionati';
  legalLinksBox.appendChild(link3);

  disclaimerSection.appendChild(legalLinksBox);
  pageWrapper.appendChild(disclaimerSection);

  // Footer
  const footerEl = document.createElement('footer');
  footerEl.className = 'tessera-footer';
  const privacyLink = document.createElement('a');
  privacyLink.href = 'https://www.abboaps.org/privacy-policy';
  privacyLink.target = '_blank';
  privacyLink.rel = 'noopener noreferrer';
  privacyLink.textContent = 'Informativa sulla privacy ABBO APS';
  footerEl.appendChild(privacyLink);

  pageWrapper.appendChild(footerEl);
  container.appendChild(pageWrapper);
}

function appendLinkIcon(container: HTMLElement, iconName?: string): void {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  const add = (tag: string, attributes: Record<string, string>): void => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    svg.appendChild(element);
  };

  switch (iconName) {
    case 'instagram':
      add('rect', { x: '2.5', y: '2.5', width: '19', height: '19', rx: '5' });
      add('circle', { cx: '12', cy: '12', r: '4' });
      add('circle', { cx: '17.5', cy: '6.5', r: '.7', fill: 'currentColor', stroke: 'none' });
      break;
    case 'linkedin':
      add('path', { d: 'M5 8.5V19M5 5.2v.1M10 19v-5.8a3.2 3.2 0 0 1 6.4 0V19M10 11v8' });
      break;
    case 'tiktok':
      add('path', { d: 'M15.2 4.2c.4 2.2 1.7 3.5 3.8 3.7v2.7a8 8 0 0 1-3.8-1.1v5.1a5 5 0 1 1-4.3-5v2.8a2.3 2.3 0 1 0 1.6 2.2V4.2h2.7Z', fill: 'currentColor', stroke: 'none' });
      break;
    case 'discord':
      add('path', { d: 'M20.3 4.4a19.8 19.8 0 0 0-4.9-1.5c-.2.4-.5.9-.7 1.3a18.8 18.8 0 0 0-5.5 0c-.2-.4-.4-.9-.6-1.3a19.7 19.7 0 0 0-4.9 1.5C1 8.2.3 12.8.7 17.4c2 1.5 4 2.4 6 3 .5-.6.9-1.3 1.2-2-.6-.2-1.3-.5-1.9-.9 1.3-1 2.5-1.4 3.9-1.4s2.6.4 3.9 1.4c-.6.4-1.2.7-1.9.9.4.7.8 1.4 1.2 2 2-.6 4-1.5 6-3 .5-5.2-.8-9.7-3.5-13.6ZM8 15.3c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z', fill: 'currentColor', stroke: 'none' });
      break;
    case 'mail':
      add('rect', { x: '3', y: '5', width: '18', height: '14', rx: '2' });
      add('path', { d: 'm3 7 9 6 9-6' });
      break;
    case 'heart':
      add('path', { d: 'M20.8 8.8c0 5.4-8.8 10-8.8 10s-8.8-4.6-8.8-10a4.7 4.7 0 0 1 8.8-2.3 4.7 4.7 0 0 1 8.8 2.3Z' });
      break;
    case 'shield':
      add('path', { d: 'M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z' });
      break;
    default:
      add('path', { d: 'M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1' });
  }

  container.appendChild(svg);
}
