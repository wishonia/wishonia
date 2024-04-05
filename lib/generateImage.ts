import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type ResolutionType = "512x512" | "256x256" | "1024x1024" | "1792x1024" | "1024x1792" | null | undefined;

export async function generateImage(body: { prompt: string, resolution?: ResolutionType, amount?: number}) {
    const { prompt, amount = 1, resolution = "512x512" } = body;

    // "512x512" | "256x256" | "1024x1024" | "1792x1024" | "1024x1792" | null | undefined

    if (!process.env.OPENAI_API_KEY) {
        throw Error("OpenAI API Key not configured.");
    }

    if (!prompt) {
        throw Error("Prompt is required");
    }

    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: amount || 1,
        size: resolution as ResolutionType || "512x512"
    });

    return response.data;
}