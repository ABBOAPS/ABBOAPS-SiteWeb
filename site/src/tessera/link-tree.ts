/**
 * Loader e validatore di sicurezza per i link della galleria associativa.
 */

export interface TesseraLinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon?: string;
}

export interface TesseraLinksConfig {
  links: TesseraLinkItem[];
}

/**
 * Valida che un URL utilizzi esclusivamente i protocolli https: o mailto:.
 */
export function isValidLinkUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();

  try {
    const parsed = new URL(trimmed, 'https://www.abboaps.org');
    return parsed.protocol === 'https:' || parsed.protocol === 'mailto:';
  } catch {
    return false;
  }
}

/**
 * Carica dal JSON statico i link e filtra solo gli URL sicuri.
 */
export async function fetchAndValidateTesseraLinks(
  baseUrl: string = '',
  fetchImpl: typeof fetch = (typeof fetch !== 'undefined' ? fetch : (async () => ({} as any)))
): Promise<TesseraLinkItem[]> {
  try {
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const jsonUrl = `${cleanBase}data/tessera-links.json`;

    const res = await fetchImpl(jsonUrl, { cache: 'no-cache' });
    if (!res.ok) return getDefaultFallbackLinks();

    const data: TesseraLinksConfig = await res.json();
    if (!data || !Array.isArray(data.links)) return getDefaultFallbackLinks();

    return data.links.filter((link) => link && link.title && link.url && isValidLinkUrl(link.url));
  } catch {
    return getDefaultFallbackLinks();
  }
}

/**
 * Fallback statico per i link principali ABBO APS nel caso di mancata risposta del server statico.
 */
export function getDefaultFallbackLinks(): TesseraLinkItem[] {
  return [
    {
      id: 'instagram',
      title: 'Instagram',
      subtitle: 'Seguici su Instagram',
      url: 'https://instagram.com/abboaps',
      icon: 'instagram',
    },
    {
      id: 'website',
      title: 'Sito ufficiale',
      subtitle: 'Scopri ABBO APS',
      url: 'https://www.abboaps.org',
      icon: 'globe',
    },
    {
      id: 'email',
      title: 'Contattaci',
      subtitle: 'Scrivi ad ABBO APS',
      url: 'mailto:info@abboaps.org',
      icon: 'mail',
    },
    {
      id: 'paypal',
      title: 'Sostieni ABBO',
      subtitle: 'Fai una donazione',
      url: 'https://www.paypal.com/donate/?hosted_button_id=ABBOAPS',
      icon: 'heart',
    },
    {
      id: 'privacy',
      title: 'Informativa Privacy',
      subtitle: 'Trattamento dati personali',
      url: 'https://www.abboaps.org/privacy-policy',
      icon: 'shield',
    },
  ];
}
