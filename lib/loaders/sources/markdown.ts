import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import grayMatter from "gray-matter";
import {MarkdownReader} from "llamaindex";

interface Section {
  content: string;
  heading: string;
  level: number;
  slug: string;
}

function extractMetaExport(content: string): Record<string, any> | undefined {
  const metaRegex = /export\s+const\s+meta\s*=\s*(\{[\s\S]*?\})/;
  const match = content.match(metaRegex);

  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error('Error parsing meta export:', error);
    }
  }
    const matter = grayMatter(content);
    if(matter.data){
      return matter.data;
    }

  return undefined;
}

function splitSections(content: string): Section[] {
  const sectionRegex = /^(#+)\s(.*)$/;
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let inFrontmatter = false;
  let frontmatterContent = '';

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle YAML frontmatter
    if (line.trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      } else {
        inFrontmatter = false;
        // Create a section for the frontmatter
        sections.push({
          content: frontmatterContent,
          heading: 'Frontmatter',
          level: 0,
          slug: 'frontmatter'
        });
        continue;
      }
    }

    if (inFrontmatter) {
      frontmatterContent += line + '\n';
      continue;
    }

    const match = sectionRegex.exec(line);

    if (match) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const [fullMatch, heading, title] = match;
      const level = heading.length;
      const slug = title.toLowerCase().replace(/\s+/g, '-');
      currentSection = { content: fullMatch + '\n', heading: title, level, slug };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    } else {
      // If we're not in a section and not in frontmatter, create a default section
      currentSection = {
        content: line + '\n',
        heading: 'Content',
        level: 0,
        slug: 'content'
      };
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  if(!sections.length){
    const markdownReader = new MarkdownReader();
    const tups = markdownReader.markdownToTups(content);
    for (const [heading, text] of tups) {
      sections.push(
        {
          content: text,
          heading: heading || '',
          level: 1,
          slug: heading?.toLowerCase().replace(/\s+/g, '-') || ''
        }
      )
    }
  }
  return sections;
}

export class MarkdownSource {
  type: 'markdown' = 'markdown';
  source: string;
  filePath: string;
  parentFilePath?: string;
  path: string;
  parentPath?: string;
  checksum?: string;
  meta?: Record<string, any>;
  sections?: Section[];

  constructor(source: string, filePath: string, parentFilePath?: string) {
    this.source = source;
    this.filePath = filePath;
    this.parentFilePath = parentFilePath;
    this.path = filePath.replace(/^pages/, '').replace(/\.md$/, '');
    this.parentPath = parentFilePath
        ?.replace(/^pages/, '')
        .replace(/\.md$/, '');
  }

  async load(): Promise<{
    checksum: string;
    meta?: Record<string, any>;
    sections: Section[];
  }> {
    const contents = await readFile(this.filePath, 'utf8');

    const checksum = createHash('sha256').update(contents).digest('base64');
    const meta = extractMetaExport(contents);
    let sections = splitSections(contents);
    if(!sections.length){
      const grayMatterData = grayMatter(contents);
        sections.push(
            {
              content: grayMatterData.content,
              heading: grayMatterData.data.title,
              level: 1,
              slug: grayMatterData.data.title.toLowerCase().replace(/\s+/g, '-')
            }
        )
    }

    this.checksum = checksum;
    this.meta = meta;
    this.sections = sections;

    return {
      checksum,
      meta,
      sections,
    };
  }
}