import { Helmet } from "react-helmet-async";
import siteConfig from "../config/site_config.json";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  jsonLd?: any;
  children?: React.ReactNode;
}

export function SEO({ title, description, image, url, jsonLd, children }: SEOProps) {
  const finalTitle = title === "Creiamo i momenti a cui vorresti tornare"
    ? `${siteConfig.seo.title_base} | ${title}`
    : title
      ? `${title} | ${siteConfig.seo.title_base}`
      : siteConfig.seo.title_base;
  const finalDescription = description || siteConfig.seo.description;
  const finalImage = image || siteConfig.seo.og_image;
  const finalUrl = url ? `${siteConfig.seo.url}${url}` : siteConfig.seo.url;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      
      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}

      {children}
    </Helmet>
  );
}
