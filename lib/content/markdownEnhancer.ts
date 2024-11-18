import { ContentEnhancer, BlockType } from '../services/content-enhancer';
import { SourceLinker } from '../services/source-linker';
import { ImageService } from '../services/image-service';
import { TavilyClient, TavilySearchResult } from '../clients/tavily';

export interface Source extends TavilySearchResult {
  textToHyperlink: string;
}

export interface SuggestedImage {
  description: string;
  url: string;
}

export interface MarkdownEnhancementResult {
  content: string;
  success: boolean;
  termsLinked: number;
  imagesAdded: number;
  sources: Source[];
  suggestedImages: SuggestedImage[];
}

export class MarkdownEnhancer {
  private contentEnhancer: ContentEnhancer;
  private sourceLinker: SourceLinker;
  private imageService: ImageService;

  constructor(tavilyApiKey: string) {
    const tavilyClient = new TavilyClient(tavilyApiKey);
    this.contentEnhancer = new ContentEnhancer();
    this.sourceLinker = new SourceLinker(tavilyClient);
    this.imageService = new ImageService(tavilyClient);
  }

  async enhance(content: string, title?: string): Promise<MarkdownEnhancementResult> {
    console.log('🔍 Analyzing content for:', title);
    const blocks = await this.contentEnhancer.analyzeContent(content, title);
      
    let enhancedContent = '';
    const sources: Source[] = [];
    const images: SuggestedImage[] = [];
    
    for (const block of blocks) {
        try {
            console.log(`📝 Processing block type: ${block.type}`);
            
            switch (block.type) {
                case BlockType.AppendText:
                    enhancedContent += block.content;
                    console.log('✏️ Appended text block');
                    break;
                    
                case BlockType.HyperlinkSource:
                    const searchResults = await this.sourceLinker.findSource(
                        block.metadata?.searchQuery || block.content
                    );
                    if (searchResults.length > 0) {
                        const linkText = block.metadata?.textToHyperlink || block.content;
                        enhancedContent += `\n[${linkText}](${searchResults[0].url})\n`;
                        searchResults.forEach(result => {
                            sources.push({
                                ...result,
                                textToHyperlink: linkText
                            });
                        });
                        console.log('🔗 Added hyperlink for:', linkText);
                    } else {
                        enhancedContent += block.content;
                        console.log('⚠️ No source found for:', block.content);
                    }
                    break;
                    
                case BlockType.InsertWebImage:
                    const webImage = await this.imageService.findImage(
                        block.metadata?.searchQuery || block.content
                    );
                    if (webImage) {
                        enhancedContent += `\n![${webImage.description}](${webImage.url})\n`;
                        images.push({
                            description: webImage.description,
                            url: webImage.url
                        });
                        console.log('🖼️ Added web image:', webImage.description);
                    } else {
                        console.log('⚠️ No web image found for:', block.content);
                    }
                    break;
                    
                case BlockType.GenerateAiImage:
                    const aiImage = await this.imageService.generateImage(
                        block.metadata?.imagePrompt || block.content
                    );
                    if (aiImage) {
                        enhancedContent += `\n![${aiImage.description}](${aiImage.url})\n`;
                        images.push({
                            description: aiImage.description,
                            url: aiImage.url
                        });
                        console.log('🎨 Generated AI image:', aiImage.description);
                    } else {
                        console.log('⚠️ Failed to generate AI image for:', block.content);
                    }
                    break;
            }
        } catch (error) {
            console.error('❌ Error processing block:', {
                type: block.type,
                content: block.content,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            // Continue with next block despite error
            continue;
        }
    }

    console.log(`✅ Enhancement complete: ${sources.length} sources, ${images.length} images`);
    const contentWithReferences = this.addReferencesSection(enhancedContent, sources);

    return {
      content: contentWithReferences,
      success: true,
      termsLinked: sources.length,
      imagesAdded: images.length,
      sources,
      suggestedImages: images
    };
  }

  private addReferencesSection(content: string, sources: Source[]): string {
    if (sources.length === 0) return content;

    const sourcesByText = sources.reduce((acc, source) => {
        if (!acc[source.textToHyperlink]) {
            acc[source.textToHyperlink] = [];
        }
        acc[source.textToHyperlink].push(source);
        return acc;
    }, {} as Record<string, Source[]>);

    const references = Object.entries(sourcesByText)
        .map(([text, sources]) => {
            const sourcesList = sources
                .map((source, index) => {
                    const domain = new URL(source.url).hostname.replace('www.', '');
                    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
                    
                    const title = source.title || "Online Article";
                    const date = source.publishedDate 
                        ? new Date(source.publishedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : '';
                    
                    // Build the reference entry with available metadata
                    let reference = `   ${String.fromCharCode(97 + index)}. ![${domain} favicon](${faviconUrl}) [${title}](${source.url})`;
                    
                    // Add source metadata if available
                    const metadata = [
                        domain,
                        date,
                        source.score ? `Relevance: ${(source.score * 100).toFixed(0)}%` : '',
                        source.content ? `\n      > ${source.content.substring(0, 150)}...` : ''
                    ].filter(Boolean);

                    reference += `. ${metadata.join(' • ')}`;

                    return reference;
                })
                .join('\n\n');

            return `### ${text}\n${sourcesList}`;
        })
        .join('\n\n---\n\n');

    return `${content.trim()}\n\n## References\n${references}\n`;
  }
} 