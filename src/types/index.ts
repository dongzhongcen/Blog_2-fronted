export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  likes: number;
  views: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface GitHubContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface AdItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  link: string;
  type: 'sidebar' | 'banner' | 'inline';
}

export type Theme = 'light' | 'dark';
