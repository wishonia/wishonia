import { TavilyClient } from '../clients/tavily';
import { TavilySearchResult } from '@tavily/core';


export class SourceLinker {
  constructor(private tavilyClient: TavilyClient) {}

  async findSource(searchTerm: string, suggestedText?: string): Promise<TavilySearchResult[]> {
    const searchResults = await this.tavilyClient.searchTopic(searchTerm);
      
    if (searchResults.results && searchResults.results.length > 0) {
      return searchResults.results;
    }
    
    return [];
  }

  async addSourceLinks(content: string, claimsToLink: string[]): Promise<{
    content: string;
    sources: TavilySearchResult[];
  }> {
    const sources: TavilySearchResult[] = [];
    let updatedContent = content;

    for (const claim of claimsToLink) {
      const results = await this.findSource(claim);
      if (results.length > 0) {
        sources.push(...results);
        updatedContent = updatedContent.replace(
          claim,
          `[${claim}](${results[0].url})`
        );
      }
    }

    return {
      content: updatedContent,
      sources
    };
  }
} 