import { MarkdownFile } from "./markdownFile";
export type MarkdownPage = MarkdownFile & {
  url: string;
};