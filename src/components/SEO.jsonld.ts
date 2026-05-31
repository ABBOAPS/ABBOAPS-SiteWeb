export function useJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Abbo APS",
    "url": "https://abboaps.it",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://abboaps.it/notizie?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "hasPart": [
      {
        "@type": "SiteNavigationElement",
        "name": "Statuto e Codice Etico",
        "url": "https://abboaps.it/documenti/statuto"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Sostienici",
        "url": "https://abboaps.it/sostienici"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Contatti",
        "url": "https://abboaps.it/contatti"
      }
    ]
  };
}
