import { Helmet } from "react-helmet-async";
import { buildAbbiamoEventSchema, abbiamoData } from "../data/abbiamo";
import { FestivalAbbiamoContent } from "../components/abbiamo/FestivalAbbiamoContent";
import "../styles/abbiamo.css";

export function Abbiamo() {
  const schema = buildAbbiamoEventSchema();

  return (
    <>
      <Helmet>
        <title>{abbiamoData.title}</title>
        <meta name="description" content={abbiamoData.description} />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content={abbiamoData.colors.primary} />
        <meta property="og:title" content={abbiamoData.title} />
        <meta property="og:description" content={abbiamoData.description} />
        <meta property="og:url" content={abbiamoData.canonicalUrl} />
        <meta property="og:type" content="event" />
        <meta property="og:image" content={abbiamoData.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={abbiamoData.title} />
        <meta name="twitter:description" content={abbiamoData.description} />
        <meta name="twitter:image" content={abbiamoData.ogImage} />
        <link rel="canonical" href={abbiamoData.canonicalUrl} />
        <link rel="icon" type="image/svg+xml" href={abbiamoData.faviconSrc} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <FestivalAbbiamoContent />
    </>
  );
}
