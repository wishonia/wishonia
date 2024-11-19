import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { ArticleMetadata } from '../schemas/article'

export class FileService {
  private outputDir: string

  constructor(outputDir: string) {
    this.outputDir = outputDir
    // Ensure output directory exists
    mkdirSync(outputDir, { recursive: true })
  }

  private createFilename(topic: string): string {
    return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }

  private logFileInfo(emoji: string, filePath: string, details?: string) {
    console.log(`   ${emoji} Saved ${path.basename(filePath)}${details ? ` (${details})` : ''}`)
  }

  saveArticle(topic: string, content: string, metadata: ArticleMetadata): void {
    const baseFilename = this.createFilename(topic)
    
    // Combine metadata and content
    const fullContent = `---
title: ${metadata.title}
description: ${metadata.description}
featured_image: ${metadata.featured_image || ''}
featured_image_alt: ${metadata.featured_image_alt || ''}
tags: [${metadata.tags.join(', ')}]
categories: [${metadata.categories.join(', ')}]
status: ${metadata.status}
date: ${metadata.date}
author: ${metadata.author}
excerpt: ${metadata.excerpt}
seo_title: ${metadata.seo_title}
seo_description: ${metadata.seo_description}
seo_keywords: [${metadata.seo_keywords.join(', ')}]
---

${content}`

    // Save article content
    const articlePath = path.join(this.outputDir, `${baseFilename}.md`)
    writeFileSync(articlePath, fullContent)
    this.logFileInfo('📄', articlePath, `${(fullContent.length / 1024).toFixed(1)}KB`)
  }

  saveRawData(topic: string, data: any): void {
    const baseFilename = this.createFilename(topic)
    const dataPath = path.join(this.outputDir, `${baseFilename}.json`)
    const jsonContent = JSON.stringify(data, null, 2)
    writeFileSync(dataPath, jsonContent)
    this.logFileInfo('🗃️', dataPath, `${(jsonContent.length / 1024).toFixed(1)}KB`)
  }
}
