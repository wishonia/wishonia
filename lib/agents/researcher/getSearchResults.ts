import Exa, {RegularSearchOptions, SearchResult} from "exa-js";
const exa = new Exa(process.env.EXA_API_KEY);

export async function getSearchResults(queries: string[], options?: RegularSearchOptions): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    for (const query of queries) {
        const searchResponse = await exa.searchAndContents(query, {
            numResults: options?.numResults ?? 5,
            useAutoprompt: options?.useAutoprompt ?? false,
            ...options,
        });
        results.push(...searchResponse.results);
    }
    return results;
}

export async function getSearchResultsByDomain(domain: string, queries: string[], options?: RegularSearchOptions): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    for (const query of queries) {
        const searchResponse = await exa.searchAndContents(query, {
            numResults: options?.numResults ?? 5,
            useAutoprompt: options?.useAutoprompt ?? false,
            includeDomains: [domain],
            ...options,
        });
        results.push(...searchResponse.results);
    }
    return results;
}

export async function getSearchResultsByUrl(url: string, linksPerQuery: number = 5): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const searchResponse = await exa.getContents(
        [url],
        {
          text: {
            maxCharacters: 10000,
            includeHtmlTags: false
          }
        }
      )
    results.push(...searchResponse.results);
    return results;
}
