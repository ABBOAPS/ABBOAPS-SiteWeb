const BASE_URL = "https://www.abboaps.it";
const LOGO_URL = `${BASE_URL}/logo.png`;

/**
 * Genera lo schema Organization/NGO per ABBO APS.
 */
export const generateNgoSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "ABBO APS",
    "alternateName": "ABBO Associazione di Promozione Sociale",
    "url": BASE_URL,
    "logo": LOGO_URL,
    "description": "Officina sociale: diamo scheletri di cemento e ferro per sostenere progetti per ragazzi e l'open source nel sociale in Brianza e Lombardia.",
    "areaServed": ["Monza", "Brianza", "Lecco", "Bergamo", "Milano"],
    "taxID": "#", // Placeholder
    "vatID": "#", // Placeholder
    "foundingLocation": {
      "@type": "Place",
      "name": "Monza e Brianza"
    },
    "keywords": "sociale, giovani, no-profit, open source sociale, Monza, Brianza"
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
        "url": LOGO_URL
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
