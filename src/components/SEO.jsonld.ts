export function useJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Abbo APS",
    "url": "https://abboaps.org",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://abboaps.org/notizie?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "hasPart": [
      {
        "@type": "SiteNavigationElement",
        "name": "Statuto e Codice Etico",
        "url": "https://abboaps.org/documenti/statuto"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Sostienici",
        "url": "https://abboaps.org/sostienici"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Contatti",
        "url": "https://abboaps.org/contatti"
      }
    ]
  };
}
