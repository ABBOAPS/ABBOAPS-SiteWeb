export interface PressMention {
  publication: string;
  publicationLogo: string;
  title: string;
  date: string;
  dateTime: string;
  url: string;
  excerpt: string;
  project: "abbiamo";
}

export const pressMentions: PressMention[] = [
  {
    publication: "MerateOnline",
    publicationLogo: "/press/merateonline-logo-new.png",
    title: "Verderio: a ottobre la prima edizione del Festival ABBIAMO, dedicato al volontariato",
    date: "3 settembre 2026",
    dateTime: "2026-09-03",
    url: "https://www.merateonline.it/notizie/159401/verderio-a-ottobre-la-prima-edizione-del-festival-abbiamo-dedicato-al-volontariato",
    excerpt: "La presentazione del Festival, nato per mettere in rete le associazioni del territorio.",
    project: "abbiamo",
  },
  {
    publication: "MerateOnline",
    publicationLogo: "/press/merateonline-logo-new.png",
    title: "Verderio: tante associazioni per il 1° festival “Abbiamo”",
    date: "5 ottobre 2026",
    dateTime: "2026-10-05",
    url: "https://www.merateonline.it/notizie/160363/verderio-tante-associazioni-per-il-1-deg-festival-ldquo-abbiamo-rdquo",
    excerpt: "Il racconto della prima edizione, tra stand, talk, attività e nuove connessioni.",
    project: "abbiamo",
  },
  {
    publication: "CSV Monza Lecco Sondrio",
    publicationLogo: "/abbiamo/csv-monza-lecco-sondrio-ets.png",
    title: "Festival ABBIAMO – Fiera delle Associazioni",
    date: "1 settembre 2026",
    dateTime: "2026-09-01",
    url: "https://www.csvlombardia.it/lecco/lc-per-approfondire/lc-per-approfondire-eventi/post/festival-abbiamo-fiera-delle-associazioni/",
    excerpt: "L’articolo del CSV presenta ABBIAMO come una giornata per incontrarsi, partecipare e avvicinarsi al volontariato.",
    project: "abbiamo",
  },
];
