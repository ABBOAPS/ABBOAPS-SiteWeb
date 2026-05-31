export interface Project {
  id: string;
  title: string;
  is_video: boolean;
  bg_src: string;
  thumbnail: string;
  cta: string;
  icon?: string;
  description?: string;
  url?: string;
}

export interface ChiSiamoData {
  heading: string;
  paragraphs: string[];
}

export interface PatreonStats {
  subscriberCount: number;
  monthlyIncome: number;
}
