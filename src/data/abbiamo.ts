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
  logoSrc: string | null;
  logoWidth?: number;
  logoHeight?: number;
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

const abcSportLogo = partnerAsset("logo-abc-sport.webp");

const participantLogos = {
  fiumeDiVita: abbiamoAsset("participants/loghi associazioni_FIUME DI VITA.svg"),
  techApp: abbiamoAsset("participants/loghi associazioni_TECH-APP.svg"),
  vimelug: abbiamoAsset("participants/loghi associazioni_VIMELUG.svg"),
  unAmicoAlTelefono: abbiamoAsset("participants/loghi associazioni_UN AMICO AL TELEFONO.svg"),
  coderDojo: abbiamoAsset("participants/loghi associazioni_CODERDOJO.svg"),
  genitoriBernareggioVillanova: abbiamoAsset("participants/loghi associazioni_ASS. GENITORI BERNAREGGIO VILLANOVA.svg"),
  oltreGioco: abbiamoAsset("participants/loghi associazioni_OLTREGIOCO.svg"),
  mediciSenzaFrontiere: abbiamoAsset("participants/loghi associazioni_MEDICI SENZA FRONTIERE.svg"),
  riCircolo: abbiamoAsset("participants/ricircolo.png"),
} as const;

export const abbiamoData = {
  name: "Festival ABBIAMO",
  edition: 2026,
  title: "Festival ABBIAMO a Verderio | Fiera delle associazioni 2026",
  eventName: "Festival ABBIAMO 2026 – Fiera delle associazioni",
  payoff: "Non una fiera da guardare, ma un territorio da vivere.",
  description:
    "Festival ABBIAMO è la fiera delle associazioni e del volontariato a Verderio (LC): domenica 4 ottobre 2026, dalle 14:00 alle 19:00. Attività, talk, spettacoli e realtà del territorio.",
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
    body: "Festival ABBIAMO è la fiera delle associazioni e del volontariato promossa da ABBO APS a Verderio, nel territorio del Meratese in provincia di Lecco. Domenica 4 ottobre 2026 il Centro Sportivo di Verderio riunirà realtà del territorio, famiglie e cittadini per un pomeriggio di attività, incontri, talk e spettacoli.",
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
    { name: "Fiume di Vita ETS", logoSrc: participantLogos.fiumeDiVita, logoWidth: 100, logoHeight: 100 },
    { name: "Tech-APP", logoSrc: participantLogos.techApp, logoWidth: 100, logoHeight: 100 },
    { name: "VIMELUG", logoSrc: participantLogos.vimelug, logoWidth: 75, logoHeight: 100 },
    { name: "Verderio Oggi", logoSrc: null },
    { name: "Un Amico al Telefono", logoSrc: participantLogos.unAmicoAlTelefono, logoWidth: 100, logoHeight: 100 },
    { name: "CoderDojo", logoSrc: participantLogos.coderDojo, logoWidth: 100, logoHeight: 62 },
    { name: "Associazione Sindrome Bardet-Biedl", logoSrc: abbiamoAsset("participants/ASBBI.png"), logoWidth: 2479, logoHeight: 825 },
    { name: "Associazione Genitori Bernareggio Villanova", logoSrc: participantLogos.genitoriBernareggioVillanova, logoWidth: 75, logoHeight: 100 },
    { name: "ABBO APS", logoSrc: publicAsset("logo_abbo_nero.svg"), logoWidth: 500, logoHeight: 167 },
    { name: "ABC Sport", logoSrc: abcSportLogo, logoWidth: 240, logoHeight: 193 },
    { name: "Digital Heroes", category: "progetto ABBO APS", logoSrc: publicAsset("logo_dh_viola.svg"), logoWidth: 480, logoHeight: 322 },
    { name: "OltreGioco APS", logoSrc: participantLogos.oltreGioco, logoWidth: 100, logoHeight: 100 },
    { name: "SE@SONROSE ODV", logoSrc: abbiamoAsset("participants/Sesonrose.png"), logoWidth: 832, logoHeight: 832 },
    { name: "Medici Senza Frontiere", logoSrc: participantLogos.mediciSenzaFrontiere, logoWidth: 100, logoHeight: 85 },
    { name: "RiCircolo", logoSrc: participantLogos.riCircolo, logoWidth: 899, logoHeight: 899 },
  ] satisfies AbbiamoParticipant[],
  faqs: [
    {
      question: "Quanto costa partecipare?",
      answer: "La partecipazione a Festival ABBIAMO è gratuita.",
    },
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
    "@type": "Event",
    "@id": `${abbiamoData.canonicalUrl}#event`,
    name: abbiamoData.eventName,
    url: abbiamoData.canonicalUrl,
    startDate: "2026-10-04T14:00:00+02:00",
    endDate: "2026-10-04T19:00:00+02:00",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    isAccessibleForFree: true,
    location: {
      "@type": "Place",
      name: abbiamoData.locationName,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Via Caduti della Libertà 56",
        postalCode: "23878",
        addressLocality: abbiamoData.locality,
        addressRegion: abbiamoData.province,
        addressCountry: "IT",
      },
    },
    image: [{
      "@type": "ImageObject",
      url: abbiamoData.ogImage,
      width: 1200,
      height: 630,
    }],
    description: abbiamoData.description,
    organizer: {
      "@id": "https://abboaps.org/#organization",
      "@type": "Organization",
      name: "ABBO APS",
      url: "https://abboaps.org/",
    },
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
