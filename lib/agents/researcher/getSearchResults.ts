import Exa, {SearchResult} from "exa-js";
const exa = new Exa(process.env.EXA_API_KEY);

export async function getSearchResults(queries: string[], linksPerQuery: number = 5): Promise<SearchResult[]> {
    let results: SearchResult[] = [];
    for (const query of queries) {
        const searchResponse = await exa.searchAndContents(query, {
            numResults: linksPerQuery,
            useAutoprompt: false,
        });
        results.push(...searchResponse.results);
    }
    return results;
}
