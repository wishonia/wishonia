import {getLLMResponse} from "@/lib/agents/getLLMResponse";

export async function generateSearchQueries(topic: string, n: number): Promise<string[]> {
    const userPrompt =
        `Generate ${n} search queries for researching: ${topic}. 
        Provide only the queries, each on a new line, without any additional text or numbering.`;

    const completion = await getLLMResponse({
        system: "You are a research assistant specializing in creating effective search queries.",
        user: userPrompt,
        temperature: 0.7,
    });
    return completion
        .split("\n")
        .filter((s) => s.trim().length > 0)
        .slice(0, n);
}
