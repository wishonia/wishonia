declare module '@tavily/core' {
  export interface TavilySearchOptions {
    searchDepth?: "basic" | "advanced";
    topic?: "general" | "news" | "finance";
    days?: number;
    maxResults?: number;
    includeImages?: boolean;
    includeImageDescriptions?: boolean;
    includeAnswer?: boolean;
    includeRawContent?: boolean;
    includeDomains?: Array<string>;
    excludeDomains?: Array<string>;
    maxTokens?: number;
  }

  export interface TavilyImage {
    url: string;
    description?: string;
  }

  export interface TavilySearchResult {
    title: string;
    url: string;
    content: string;
    rawContent?: string;
    score: number;
    publishedDate: string;
  }

  export interface TavilySearchResponse {
    answer?: string;
    query: string;
    responseTime: number;
    images: Array<TavilyImage>;
    results: Array<TavilySearchResult>;
  }

  export interface TavilyClient {
    search: (query: string, options: TavilySearchOptions) => Promise<TavilySearchResponse>;
  }

  export function tavily(options?: { apiKey?: string }): TavilyClient;
} 