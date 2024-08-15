import dotenv from 'dotenv';
import Exa from 'exa-js';
import OpenAI from 'openai';
dotenv.config();

const EXA_API_KEY = process.env.EXA_API_KEY; // paste your API key here
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // paste your API key here

const exa = new Exa(EXA_API_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function getLLMResponse({
    system = "You are a helpful assistant.",
    user = "",
    temperature = 1,
    model = "gpt-3.5-turbo",
}) {
    const completion = await openai.chat.completions.create({
        model,
        temperature,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
    });
    return completion.choices[0].message.content;
}

async function generateSearchQueries(topic, n) {
    const userPrompt = 
        `I'm writing a research report on ${topic} and need help coming up with diverse search queries.
Please generate a list of ${n} search queries that would be useful for writing a research report on ${topic}. 
These queries can be in various formats, from simple keywords to more complex phrases. 
Do not add any formatting or numbering to the queries.`;

    const completion = await getLLMResponse({
        system: "The user will ask you to help generate some search queries. " +
            "Respond with only the suggested queries in plain text with no extra formatting, each on its own line.",
        user: userPrompt,
        temperature: 1,
    });
    return completion
        .split("\n")
        .filter((s) => s.trim().length > 0)
        .slice(0, n);
}

async function getSearchResults(queries, linksPerQuery = 5) {
    let results = [];
    for (const query of queries) {
        const searchResponse = await exa.searchAndContents(query, {
            numResults: linksPerQuery,
            useAutoprompt: false,
        });
        results.push(...searchResponse.results);
    }
    return results;
}
async function synthesizeReport(topic, searchContents, contentSlice = 750) {
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
export async function researcher(topic) {
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