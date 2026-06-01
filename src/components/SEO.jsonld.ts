export function useJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Abbo APS",
    "url": "https://www.abboaps.org",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.abboaps.org/notizie?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "hasPart": [
      {
        "@type": "SiteNavigationElement",
        "name": "Statuto e Codice Etico",
        "url": "https://www.abboaps.org/documenti/statuto"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Sostienici",
        "url": "https://www.abboaps.org/sostienici"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Contatti",
        "url": "https://www.abboaps.org/contatti"
      }
    ]
  };
}
