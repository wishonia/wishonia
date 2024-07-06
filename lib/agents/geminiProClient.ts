import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function queryGeminiPro(prompt: string, temperature: number): Promise<string> {
    try {
        const model = google('models/gemini-pro', {
            topK: 0,
            safetySettings: [
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
            ]
        });

        const { text } = await generateText({
            model,
            prompt,
            temperature,
            //maxTokens: 0,
        });

        return text;
    } catch (error) {
        console.error('Error querying Google AI:', error);
        throw error;
    }
}