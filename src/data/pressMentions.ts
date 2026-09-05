export interface PressMention {
  publication: string;
  publicationLogo: string;
  title: string;
  date: string;
  dateTime: string;
  url: string;
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
    project: "abbiamo",
  },
];
