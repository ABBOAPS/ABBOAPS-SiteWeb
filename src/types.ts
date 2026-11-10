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
  is_black_and_white?: boolean;
  category?: string;
  status?: string;
  facts?: string[];
}

export interface ChiSiamoData {
  heading: string;
  paragraphs: string[];
}

