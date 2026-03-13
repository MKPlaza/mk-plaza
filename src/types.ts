export interface ThemePreset {
  midnight: string;
  eyes: string;
  gold: string;
  pixel: boolean;
  bg: string;
  logo: string;
  name: string;
  fontFamily?: string;
  fontStyle?: string;
}

export interface CloakOption {
  title: string;
  icon: string;
}

export interface Song {
  title: string;
  filename: string;
}

export interface Movie {
  title: string;
  imageUrl: string;
  link: string;
  description: string;
  year: string;
}

export interface TVShow {
  title: string;
  imageUrl: string;
  description?: string;
  year?: string;
  seasons?: {
    number: number;
    link: string;
  }[];
  links?: {
    part: string;
    url: string;
  }[];
  link?: string;
}

export interface Anime {
  title: string;
  imageUrl: string;
  description?: string;
  year?: string;
  links?: {
    part: string;
    url: string;
  }[];
  link?: string;
}

export interface Manga {
  title: string;
  imageUrl: string;
  url: string;
  description?: string;
  year?: string;
}

export interface Game {
  id: string;
  title: string;
  platform: string;
  system: string;
  year: string;
  color: string;
  desc: string;
  icon: string;
  iconColor: string;
  image: string;
  link?: string;
}

export interface FavoriteItem {
  id: string;
  type: 'movie' | 'tv' | 'anime' | 'manga' | 'game';
  title: string;
  imageUrl: string;
  link: string;
}
