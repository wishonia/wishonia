import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export async function generateTextFromMessages(messages:  OpenAI.Chat.Completions.ChatCompletionMessageParam[], model?: string){
    const completion = await openai.chat.completions.create({
        messages,
        model: model || "gpt-3.5-turbo",
    });

    if (completion.choices[0]?.message?.content) {
        return completion.choices[0].message.content.trim();
    } else {
        throw new Error("No content found in completion choices");
    }
}
