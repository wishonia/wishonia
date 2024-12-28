import { TavilySearchResult } from '@tavily/core';
import { generateObject } from 'ai';
import { z } from 'zod';

import { getModel } from '@/lib/utils/modelUtils';

import { TavilyClient } from '../clients/tavily';

const SourceLinkSuggestionSchema = z.object({
  linksToAdd: z.array(z.object({
    text: z.string().describe("The exact text from the article that should be linked"),
    searchTerm: z.string().describe("The search term to use to find a relevant source for this text")
  }))
});

const SourceEvaluationSchema = z.object({
  supports: z.boolean().describe("Whether the source actually supports the claim"),
  confidence: z.number().min(0).max(1).describe("Confidence level in the evaluation (0-1)"),
  explanation: z.string().describe("Brief explanation of why the source does or doesn't support the claim")
});

interface EvaluatedSource extends TavilySearchResult {
  evaluation?: {
    supports: boolean;
    confidence: number;
    explanation: string;
  };
}

export class SourceLinker {
  constructor(private tavilyClient: TavilyClient) {}

  private async evaluateSource(source: TavilySearchResult, claim: string): Promise<EvaluatedSource> {
    try {
      console.log(`\nEvaluating source for claim: "${claim}"`)
      console.log(`Source: "${source.title}" (${source.url})`)
      
      const result = await generateObject({
        model: getModel(),
        schema: SourceEvaluationSchema,
        prompt: `You are an expert fact checker. Evaluate if this source supports the following claim.
          
          Claim: "${claim}"
          
          Source Title: ${source.title}
          Source Content: ${source.content}
          
          Carefully evaluate if the source's content ACTUALLY supports the specific claim.
          Be strict - the source must directly support the claim, not just be related to the topic.
          If you're not confident, err on the side of saying it doesn't support the claim.
          Provide a brief explanation of your reasoning.`
      });

      console.log(`Evaluation result:`)
      console.log(`- Supports: ${result.object.supports}`)
      console.log(`- Confidence: ${result.object.confidence}`)
      console.log(`- Explanation: ${result.object.explanation}`)

      return {
        ...source,
        evaluation: result.object
      };
    } catch (error) {
      console.error(`Error evaluating source for claim "${claim}":`, error);
      return source;
    }
  }

  private addReferencesSection(content: string, sources: EvaluatedSource[]): string {
    // Get only supporting sources
    const supportingSources = sources.filter(s => s.evaluation?.supports);
    console.log(`\nAdding references section with ${supportingSources.length} supporting sources`)
    
    // Create a map to track unique sources by URL
    const uniqueSources = new Map<string, EvaluatedSource>();
    supportingSources.forEach(source => {
      if (!uniqueSources.has(source.url)) {
        uniqueSources.set(source.url, source);
      }
    });

    console.log(`Found ${uniqueSources.size} unique supporting sources`)

    // Check if a references section already exists
    const referencesRegex = /\n## References\n/i;
    if (referencesRegex.test(content)) {
      console.log('References section already exists, skipping')
      return content; // Don't modify if references section exists
    }

    // Create references section with numbered list
    let referencesSection = '\n## References\n';
    Array.from(uniqueSources.values()).forEach((source, index) => {
      referencesSection += `${index + 1}. [${source.title}](${source.url})\n`;
      console.log(`Added reference ${index + 1}: ${source.title}`)
    });

    return content + referencesSection;
  }

  async findSource(searchTerm: string, suggestedText?: string): Promise<EvaluatedSource[]> {
    console.log(`\nSearching for sources...`)
    console.log(`Search term: "${searchTerm}"`)
    if (suggestedText) {
      console.log(`Original text: "${suggestedText}"`)
    }

    const searchResults = await this.tavilyClient.searchTopic(searchTerm);
    console.log(`Found ${searchResults.results?.length || 0} potential sources`)
      
    if (searchResults.results && searchResults.results.length > 0) {
      if (suggestedText) {
        // Evaluate each source for claim support
        console.log(`Evaluating ${searchResults.results.length} sources for claim support...`)
        const evaluatedResults = await Promise.all(
          searchResults.results.map(result => this.evaluateSource(result, suggestedText))
        );
        return evaluatedResults;
      }
      return searchResults.results;
    }
    
    console.log('No sources found')
    return [];
  }

  async addSourceLinks(content: string, claimsToLink: string[]): Promise<{
    content: string;
    sources: EvaluatedSource[];
  }> {
    console.log(`\nAdding source links for ${claimsToLink.length} claims`)
    const sources: EvaluatedSource[] = [];
    let updatedContent = content;

    for (const claim of claimsToLink) {
      console.log(`\nProcessing claim: "${claim}"`)
      const results = await this.findSource(claim, claim);
      if (results.length > 0) {
        // Find the best supporting source
        const supportingSources = results.filter(r => r.evaluation?.supports);
        console.log(`Found ${supportingSources.length} supporting sources out of ${results.length} total`)
        
        if (supportingSources.length > 0) {
          // Sort by confidence
          const bestSource = supportingSources.sort((a, b) => 
            (b.evaluation?.confidence || 0) - (a.evaluation?.confidence || 0)
          )[0];
          
          console.log(`Selected best source: "${bestSource.title}" (confidence: ${bestSource.evaluation?.confidence})`)
          sources.push(...results); // Keep all results for reference
          updatedContent = updatedContent.replace(
            claim,
            `[${claim}](${bestSource.url})`
          );
          console.log(`Added link to content`)
        } else {
          console.error(`No supporting sources found for claim: "${claim}"`);
          sources.push(...results); // Keep the results for reference
        }
      } else {
        console.log(`No sources found for claim`)
      }
    }

    // Add references section
    updatedContent = this.addReferencesSection(updatedContent, sources);

    return {
      content: updatedContent,
      sources
    };
  }

  async autoLinkSources(content: string): Promise<{
    content: string;
    sources: EvaluatedSource[];
  }> {
    console.log('\n=== Starting automatic source linking ===')
    
    // Generate suggestions for which text should be linked
    console.log('\nIdentifying claims to link...')
    const result = await generateObject({
      model: getModel(),
      schema: SourceLinkSuggestionSchema,
      prompt: `You are an expert at identifying claims and statements in articles that should be backed by sources.
        Given the following article, identify specific text snippets that should be linked to sources.
        Only select factual claims, statistics, or specific statements that would benefit from a source.
        Do not select opinions or general statements.
        Return the exact text as it appears in the article.
        For each text, provide a search term that would help find a relevant source.
        
        Article:
        ${content}`
    });

    console.log(`\nIdentified ${result.object.linksToAdd.length} claims to link:`)
    result.object.linksToAdd.forEach((suggestion, index) => {
      console.log(`\nClaim ${index + 1}:`)
      console.log(`Text: "${suggestion.text}"`)
      console.log(`Search term: "${suggestion.searchTerm}"`)
    });

    // Use the suggestions to add source links
    const sources: EvaluatedSource[] = [];
    let updatedContent = content;

    for (const suggestion of result.object.linksToAdd) {
      console.log(`\nProcessing claim: "${suggestion.text}"`)
      const results = await this.findSource(suggestion.searchTerm, suggestion.text);
      if (results.length > 0) {
        // Find the best supporting source
        const supportingSources = results.filter(r => r.evaluation?.supports);
        console.log(`Found ${supportingSources.length} supporting sources out of ${results.length} total`)
        
        if (supportingSources.length > 0) {
          // Sort by confidence
          const bestSource = supportingSources.sort((a, b) => 
            (b.evaluation?.confidence || 0) - (a.evaluation?.confidence || 0)
          )[0];
          
          console.log(`Selected best source: "${bestSource.title}" (confidence: ${bestSource.evaluation?.confidence})`)
          sources.push(...results); // Keep all results for reference
          // Use regex to replace the exact text while preserving case
          const regex = new RegExp(suggestion.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          updatedContent = updatedContent.replace(
            regex,
            `[${suggestion.text}](${bestSource.url})`
          );
          console.log(`Added link to content`)
        } else {
          console.error(`No supporting sources found for text: "${suggestion.text}"`);
          sources.push(...results); // Keep the results for reference
        }
      } else {
        console.log(`No sources found for claim`)
      }
    }

    // Add references section
    updatedContent = this.addReferencesSection(updatedContent, sources);

    console.log('\n=== Completed automatic source linking ===')
    console.log(`Total sources found: ${sources.length}`)
    console.log(`Supporting sources: ${sources.filter(s => s.evaluation?.supports).length}`)
    console.log(`Unique sources used: ${new Set(sources.filter(s => s.evaluation?.supports).map(s => s.url)).size}`)

    return {
      content: updatedContent,
      sources
    };
  }
} 