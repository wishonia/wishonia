// lib/openaiClient.ts
import { Configuration, OpenAIApi } from 'openai-edge';

let openaiClient: OpenAIApi;

export function getOpenaiClient(): OpenAIApi {
    if (!openaiClient) {
        const openaiApiKey = process.env.OPENAI_API_KEY;

        if (!openaiApiKey) {
            throw new Error('Missing environment variable OPENAI_API_KEY');
        }

        const configuration = new Configuration({ apiKey: openaiApiKey });
        openaiClient = new OpenAIApi(configuration);
    }

    return openaiClient;
}