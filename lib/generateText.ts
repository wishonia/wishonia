import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export async function generateText(prompt: string, model?: string){
    const completion = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        model: model || "gpt-3.5-turbo",
    });

    if (completion.choices[0]?.message?.content) {
        return completion.choices[0].message.content.trim();
    } else {
        throw new Error("No content found in completion choices");
    }
}
