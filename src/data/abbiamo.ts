import abcSportLogo from "../content/partners/logo-abc-sport.png";

export interface AbbiamoScheduleItem {
  time: string;
  dateTime?: string;
  title: string;
  description: string;
  note?: string;
}

export interface AbbiamoParticipant {
  name: string;
  category?: "progetto ABBO APS";
  logoSrc?: string;
  logoWidth?: number;
  logoHeight?: number;
  textOnly?: true;
  visualScale?: number;
}

export interface AbbiamoFaq {
  question: string;
  answer: string;
}

export interface AbbiamoSupporter {
  name: string;
  role: "patronage" | "logistics";
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
}

export type AbbiamoInfoIcon = "ticket" | "users" | "accessibility" | "parking" | "bar" | "clock" | "indoor";

const viteBaseUrl = import.meta.env?.BASE_URL ?? "/";

function publicAsset(path: string): string {
  const inCrawlableEntry = typeof window !== "undefined" && /^\/abbiamo\/?$/.test(window.location.pathname);
  const baseUrl = inCrawlableEntry && viteBaseUrl === "./" ? "../" : viteBaseUrl;
  return `${baseUrl}${path}`;
}

export function abbiamoAsset(filename: string): string {
  return publicAsset(`abbiamo/${filename}`);
}

export function partnerAsset(filename: string): string {
  return publicAsset(`partners/${filename}`);
}

function participantAsset(filename: string): string {
  return abbiamoAsset(`participants/${filename}`);
}

export const abbiamoData = {
  name: "Festival ABBIAMO",
  edition: 2026,
  title: "Festival ABBIAMO 2026 a Verderio | Fiera delle associazioni",
  eventName: "Festival ABBIAMO - Fiera delle associazioni",
  payoff: "Non una fiera da guardare, ma un territorio da vivere.",
  description:
    "Festival ABBIAMO 2026: domenica 4 ottobre, dalle 14:00 alle 19:00 al Centro Sportivo di Verderio. Associazioni, attività, talk e spettacolo.",
  date: "2026-10-04",
  dateLabel: "Domenica 4 ottobre 2026",
  startTime: "14:00",
  endTime: "19:00",
  timezone: "Europe/Rome",
  location: "Centro Sportivo di Verderio (LC)",
  locationName: "Centro Sportivo di Verderio",
  locality: "Verderio",
  province: "LC",
  mapsUrl: "https://maps.app.goo.gl/oVsHdbfCEe27xbfVA",
  canonicalUrl: "https://abboaps.org/abbiamo/",
  hashRoute: "/#/abbiamo",
  contactEmail: "info@abboaps.org",
  logoSrc: abbiamoAsset("logo-secondary.svg"),
  faviconSrc: abbiamoAsset("favicon.svg"),
  ogImage: "https://abboaps.org/abbiamo/og-image.svg",
  colors: {
    primary: "#e63033",
    cream: "#fae6d5",
  },
  intro: {
    title: "Il territorio, tutto nello stesso posto.",
    body: "Il Festival ABBIAMO nasce per riunire associazioni e cooperative no-profit del territorio in un’unica giornata di incontro, scoperta e festa. Un luogo dove cittadini e realtà locali possono conoscersi, raccontare progetti e creare nuove collaborazioni.",
  },
  experience: {
    title: "Qui non vieni solo a guardare.",
    body: "Ogni stand propone un gioco, un quiz o un’attività legata alla propria missione. Passa da uno stand all’altro, fai domande, conosci chi rende vivo il territorio e raccogli le firme sul tuo poster numerato in edizione limitata.",
  },
  program: {
    title: "Un pomeriggio da attraversare.",
  },
  information: {
    title: "Arriva, entra, partecipa.",
    items: [
      { icon: "ticket" as AbbiamoInfoIcon, text: "Ingresso gratuito" },
      { icon: "users" as AbbiamoInfoIcon, text: "Nessuna prenotazione necessaria" },
      { icon: "clock" as AbbiamoInfoIcon, text: "Puoi arrivare in qualsiasi momento durante l’apertura al pubblico" },
      { icon: "indoor" as AbbiamoInfoIcon, text: "Evento indoor, all’interno della palestra" },
      { icon: "accessibility" as AbbiamoInfoIcon, text: "Accessibile anche a persone in carrozzina" },
      { icon: "parking" as AbbiamoInfoIcon, text: "Ampio parcheggio e altri parcheggi nelle vicinanze" },
      { icon: "bar" as AbbiamoInfoIcon, text: "Bar disponibile durante il festival" },
    ],
  },
  participation: {
    title: "Vuoi partecipare?",
    body: "Rappresenti un’associazione o una realtà no-profit del territorio e vuoi partecipare ad ABBIAMO? Le adesioni sono ancora possibili: contattaci con il maggior anticipo possibile.",
  },
  schedule: [
    {
      time: "14:00–18:00",
      dateTime: "2026-10-04T14:00:00+02:00",
      title: "Esposizione e attività interattive",
      description:
        "Gli stand coinvolgono i visitatori con giochi, quiz e attività collegate alla missione delle singole realtà.",
    },
    {
      time: "14:30–17:30",
      dateTime: "2026-10-04T14:30:00+02:00",
      title: "Talk sul palco",
      description: "Associazioni e ospiti presentano progetti, storie e temi rilevanti.",
      note: "Programma degli interventi in aggiornamento.",
    },
    {
      time: "18:00–19:00",
      dateTime: "2026-10-04T18:00:00+02:00",
      title: "Spettacoli e chiusura",
      description: "Esibizione di danza, ringraziamenti e momento finale di chiusura.",
    },
    {
      time: "A seguire",
      title: "Aperitivo di Rete",
      description: "Riservato alle associazioni e agli organizzatori.",
    },
  ] satisfies AbbiamoScheduleItem[],
  participants: [
    { name: "Fiume di Vita ETS", logoSrc: participantAsset("fiume-di-vita.svg"), logoWidth: 100, logoHeight: 100, visualScale: 1.04 },
    { name: "Tech-APP", logoSrc: participantAsset("tech-app.svg"), logoWidth: 100, logoHeight: 100, visualScale: 1.08 },
    { name: "VIMELUG", logoSrc: participantAsset("vimelug.svg"), logoWidth: 75, logoHeight: 100, visualScale: 1.17 },
    { name: "Verderio Oggi", textOnly: true },
    { name: "Un Amico al Telefono", logoSrc: participantAsset("un-amico-al-telefono.svg"), logoWidth: 100, logoHeight: 100, visualScale: 1.02 },
    { name: "CoderDojo", logoSrc: participantAsset("coderdojo.svg"), logoWidth: 100, logoHeight: 62, visualScale: 0.78 },
    { name: "Associazione Sindrome Bardet-Biedl", textOnly: true },
    { name: "Associazione Genitori Bernareggio Villanova", logoSrc: participantAsset("genitori-bernareggio-villanova.svg"), logoWidth: 75, logoHeight: 100, visualScale: 1.25 },
    { name: "ABBO APS", logoSrc: publicAsset("logo_abbo_nero.svg"), logoWidth: 500, logoHeight: 167, visualScale: 1.06 },
    { name: "ABC Sport", logoSrc: abcSportLogo, logoWidth: 400, logoHeight: 322, visualScale: 0.96 },
    { name: "Digital Heroes", category: "progetto ABBO APS", logoSrc: publicAsset("logo_dh_viola.svg"), logoWidth: 480, logoHeight: 322, visualScale: 1.04 },
    { name: "OltreGioco APS", logoSrc: participantAsset("oltre-gioco.svg"), logoWidth: 100, logoHeight: 100, visualScale: 1.02 },
    { name: "SE@SONROSE ODV", textOnly: true },
    { name: "Medici Senza Frontiere", logoSrc: participantAsset("medici-senza-frontiere.svg"), logoWidth: 100, logoHeight: 85, visualScale: 1.06 },
  ] satisfies AbbiamoParticipant[],
  faqs: [
    {
      question: "Serve prenotarsi?",
      answer: "No. L’ingresso è libero e non è necessaria la prenotazione.",
    },
    {
      question: "Il festival è adatto anche ai bambini?",
      answer:
        "Sì. ABBIAMO è aperto a tutti e sono previste anche attività e stand pensati per i bambini.",
    },
    {
      question: "Posso arrivare dopo le 14:00?",
      answer:
        "Sì. Puoi arrivare durante il pomeriggio e vivere liberamente gli stand e le attività disponibili in quel momento.",
    },
    {
      question: "Dove posso parcheggiare?",
      answer:
        "Il Centro Sportivo dispone di un ampio parcheggio e sono presenti altri parcheggi nelle vicinanze.",
    },
    {
      question: "Il luogo è accessibile in carrozzina?",
      answer: "Sì. Il festival si svolge in uno spazio accessibile anche a persone in carrozzina.",
    },
    {
      question: "Ci sarà un bar?",
      answer:
        "Sì. Durante il festival sarà disponibile il bar. L’Aperitivo di Rete dopo la chiusura è riservato alle associazioni e agli organizzatori.",
    },
    {
      question: "Sono un’associazione: posso ancora partecipare?",
      answer:
        "Sì, compatibilmente con i tempi organizzativi. Scrivi ad ABBO con il maggior anticipo possibile tramite l’email ufficiale presente sul sito.",
    },
  ] satisfies AbbiamoFaq[],
  supporters: [
    {
      name: "CSV Monza Lecco Sondrio ETS",
      role: "patronage",
      logoSrc: abbiamoAsset("csv-monza-lecco-sondrio-ets.png"),
      logoWidth: 2000,
      logoHeight: 591,
    },
    {
      name: "ABC Sport",
      role: "logistics",
      logoSrc: partnerAsset("logo-abc-sport.webp"),
      logoWidth: 240,
      logoHeight: 193,
    },
  ] satisfies AbbiamoSupporter[],
} as const;

export function buildAbbiamoEventSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        name: abbiamoData.eventName,
        startDate: "2026-10-04T14:00:00+02:00",
        endDate: "2026-10-04T19:00:00+02:00",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: abbiamoData.locationName,
          address: {
            "@type": "PostalAddress",
            addressLocality: abbiamoData.locality,
            addressRegion: abbiamoData.province,
            addressCountry: abbiamoData.province === "LC" ? "IT" : undefined,
          },
        },
        image: [abbiamoData.ogImage],
        description: abbiamoData.description,
        organizer: {
          "@type": "Organization",
          name: "ABBO APS",
          url: "https://abboaps.org/",
        },
        url: abbiamoData.canonicalUrl,
      },
      {
        "@type": "FAQPage",
        mainEntity: abbiamoData.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export function buildAbbiamoIcs(): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ABBO APS//Festival ABBIAMO 2026//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:festival-abbiamo-2026@abboaps.org",
    "DTSTAMP:20260101T120000Z",
    "DTSTART;TZID=Europe/Rome:20261004T140000",
    "DTEND;TZID=Europe/Rome:20261004T190000",
    `SUMMARY:${escapeIcsText(abbiamoData.eventName)}`,
    `LOCATION:${escapeIcsText(abbiamoData.location)}`,
    `DESCRIPTION:${escapeIcsText(`${abbiamoData.description} ${abbiamoData.canonicalUrl}`)}`,
    `URL:${abbiamoData.canonicalUrl}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Promemoria Festival ABBIAMO tra 7 giorni",
    "TRIGGER:-P7DT4H",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Promemoria Festival ABBIAMO tra 3 giorni",
    "TRIGGER:-P3DT4H",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Promemoria Festival ABBIAMO oggi",
    "TRIGGER:-PT4H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.join("\r\n")}\r\n`;
}

export function buildGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: abbiamoData.eventName,
    dates: "20261004T140000/20261004T190000",
    ctz: abbiamoData.timezone,
    location: abbiamoData.location,
    details: `${abbiamoData.description}\n\n${abbiamoData.canonicalUrl}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
