const BASE_URL = "https://abboaps.org";

/**
 * Genera lo schema Organization/NGO per ABBO APS.
 */
export const generateNgoSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "ABBO APS",
    "alternateName": "ABBO Associazione di Promozione Sociale",
    "url": BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/logo_abbo_nero.svg`,
    },
    "email": "info@abboaps.org",
    "description": "ABBO APS è un’associazione di promozione sociale che crea spazi educativi, occasioni di aggregazione e progetti per i ragazzi e il territorio.",
    "areaServed": ["Monza", "Brianza", "Lecco", "Bergamo", "Milano"],
    "sameAs": [
      "https://www.instagram.com/abboaps/",
      "https://www.linkedin.com/company/abboaps/",
      "https://www.tiktok.com/@abbo.aps",
      "https://discord.gg/HDuD3tCvus",
    ],
  };
};

/**
 * Genera lo schema per la pagina News / Blog.
 */
export const generateBlogSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Le iniziative e i progetti di ABBO APS",
    "description": "Ultime notizie, bandi e attività sociali per i giovani tra Monza, Brianza e Milano.",
    "url": `${BASE_URL}/notizie`,
    "publisher": {
      "@id": `${BASE_URL}/#organization`
    }
  };
};

/**
 * Genera lo schema per un singolo articolo (NewsDetail).
 */
export const generateNewsArticleSchema = (title: string, description: string, datePublished: string, imageUrl: string, url: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "description": description,
    "image": imageUrl,
    "datePublished": datePublished,
    "author": {
      "@type": "Organization",
      "name": "ABBO APS",
      "url": BASE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "ABBO APS",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo_abbo_nero.svg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
};

/**
 * Genera lo schema per la pagina Donazioni / Supporto.
 */
export const generateDonateActionSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    "name": "Sostieni ABBO APS - Progetti per i Giovani",
    "description": "Contribuisci come volontario o donatore ai nostri progetti di open source sociale in Brianza.",
    "recipient": {
      "@type": "NGO",
      "name": "ABBO APS"
    },
    "url": `${BASE_URL}/sostienici`
  };
};
