import dotenv from 'dotenv';
import Exa from 'exa-js';
import {generateSearchQueries} from "@/lib/agents/searchQueryGenerator";
import {getLLMResponse} from "@/lib/agents/getLLMResponse";

dotenv.config();

const EXA_API_KEY = process.env.EXA_API_KEY as string;

const exa = new Exa(EXA_API_KEY);

interface SearchResult {
    url: string;
    text: string;
}

async function getSearchResults(queries: string[], linksPerQuery: number = 5): Promise<SearchResult[]> {
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

async function synthesizeReport(topic: string, searchContents: SearchResult[], contentSlice: number = 750): Promise<string> {
    const inputData = searchContents
        .map(
            (item) =>
                `--START ITEM--\nURL: ${item.url}\nCONTENT: ${item.text.slice(0, contentSlice)}\n--END ITEM--\n`,
        )
        .join("");
    return await getLLMResponse({
        system: "You are a medical research assistant. Write a report according to the user's instructions.",
        user:
            "Input Data:\n" +
            inputData +
            `Write a ${topic} based on the provided information.
Include as many sources as possible. 
Provide citations in the text using footnote notation ([#]). 
First provide the report, followed by a single "References" section that lists all the URLs used, in the format [#] <url>.`,
        model: 'gpt-4' //want a better report? use gpt-4 (but it costs more)
    });
}

export async function researcher(topic: string): Promise<string> {
    console.log(`Starting research on topic: "${topic}"`);

    const searchQueries = await generateSearchQueries(topic, 1);
    console.log("Generated search queries:", searchQueries);

    const searchResults = await getSearchResults(searchQueries, 10);
    console.log(
        `Found ${searchResults.length} search results. Here's the first one:`,
        searchResults[0],
    );

    console.log("Synthesizing report...")
    return await synthesizeReport(topic, searchResults);
}