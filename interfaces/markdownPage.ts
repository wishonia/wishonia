import type {Author} from "@/interfaces/author";
export type MarkdownPage = {
  slug?: string;
  name: string;
  date?: string;
  featuredImage?: string;
  author?: Author;
  description?: string;
  ogImage?: {
    url: string;
  };
  content: string;
  preview?: boolean;
  url: string;
};