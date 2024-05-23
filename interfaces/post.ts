import { type Author } from "./author";

export type Post = {
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
  absFilePath: string;
};
