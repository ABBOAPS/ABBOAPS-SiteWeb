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
 * Valida schema, host e forma dell'URL prima di esporlo nell'interfaccia.
 */
export function isValidLinkUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();

  try {
    const parsed = new URL(trimmed, 'https://www.abboaps.org');
    if (parsed.protocol === 'mailto:') {
      return /^[^\s@]+@abboaps\.org$/i.test(parsed.pathname);
    }

    if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.port) {
      return false;
    }

    const allowedHosts = new Set([
      'abboaps.org',
      'www.abboaps.org',
      'instagram.com',
      'www.instagram.com',
      'linkedin.com',
      'www.linkedin.com',
      'tiktok.com',
      'www.tiktok.com',
      'discord.gg',
      'paypal.com',
      'www.paypal.com',
    ]);
    return allowedHosts.has(parsed.hostname.toLowerCase());
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
      url: 'https://www.instagram.com/abboaps/',
      icon: 'instagram',
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      subtitle: 'Seguici su LinkedIn',
      url: 'https://www.linkedin.com/company/abboaps/',
      icon: 'linkedin',
    },
    {
      id: 'tiktok',
      title: 'TikTok',
      subtitle: 'Seguici su TikTok',
      url: 'https://www.tiktok.com/@abbo.aps',
      icon: 'tiktok',
    },
    {
      id: 'discord',
      title: 'Discord',
      subtitle: 'Unisciti alla community ABBO APS',
      url: 'https://discord.gg/HDuD3tCvus',
      icon: 'discord',
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
