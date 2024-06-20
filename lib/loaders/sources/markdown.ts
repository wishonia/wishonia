import { createHash } from 'crypto';
import { readFile } from 'fs/promises';

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

  return undefined;
}

function splitSections(content: string): Section[] {
  const sectionRegex = /^(#+)\s(.*)$/gm;
  const sections: Section[] = [];

  let match;
  let currentSection: Section | null = null;

  const lines = content.split('\n');
  for (const line of lines) {
    if ((match = sectionRegex.exec(line)) !== null) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const [, heading, title] = match;
      const level = heading.length;
      const slug = title.toLowerCase().replace(/\s+/g, '-');
      currentSection = { content: '', heading: title, level, slug };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
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
    const sections = splitSections(contents);

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