import siteConfig from "./site_config.json";

export const SOCIAL_LINKS = {
  instagram: siteConfig.socials.instagram,
  linkedin: siteConfig.socials.linkedin,
  tiktok: siteConfig.socials.tiktok,
  discord: siteConfig.socials.discord,
  whatsapp: siteConfig.socials.whatsapp,
} as const;

export type SocialPlatform = keyof typeof SOCIAL_LINKS;

export const OFFICIAL_SOCIALS: ReadonlyArray<{
  platform: SocialPlatform;
  label: string;
  ariaLabel: string;
  url: string;
}> = [
  { platform: "instagram", label: "Instagram", ariaLabel: "Seguici su Instagram", url: SOCIAL_LINKS.instagram },
  { platform: "linkedin", label: "LinkedIn", ariaLabel: "Seguici su LinkedIn", url: SOCIAL_LINKS.linkedin },
  { platform: "tiktok", label: "TikTok", ariaLabel: "Seguici su TikTok", url: SOCIAL_LINKS.tiktok },
  { platform: "discord", label: "Discord", ariaLabel: "Unisciti alla community ABBO APS su Discord", url: SOCIAL_LINKS.discord },
  { platform: "whatsapp", label: "WhatsApp", ariaLabel: "Scrivici su WhatsApp al numero ABBO APS", url: SOCIAL_LINKS.whatsapp },
];
