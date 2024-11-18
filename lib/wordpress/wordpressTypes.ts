export interface WordPressPost {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  categories: string[];
  status?: 'publish' | 'draft' | 'private' | 'pending';
  featured_media?: number;
  format?: 'markdown' | 'html';
  link?: string;
  slug?: string;
}

// WordPress API response types
export interface WordPressApiPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
    raw?: string;
  };
  content: {
    rendered: string;
    raw?: string;
  };
  excerpt: {
    rendered: string;
    raw?: string;
  };
  featured_media: number;
  status: 'publish' | 'draft' | 'private' | 'pending';
  categories: number[];
  tags: number[];
  link: string;
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
}

export interface WordPressMedia {
  id: number;
  source_url: string;
  title: {
    rendered: string;
    raw?: string;
  };
  media_type: string;
  alt_text?: string;
  link: string;
}

export interface WordPressError {
  code: string;
  message: string;
  data?: any;
}

export type WordPressPostStatus = 'draft' | 'publish' | 'private' | 'pending'; 