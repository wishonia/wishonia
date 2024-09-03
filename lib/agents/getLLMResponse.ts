import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface LLMResponseParams {
  system?: string;
  user: string;
  temperature?: number;
  model?: string;
}

export async function getLLMResponse({
                                  system = "You are a helpful assistant.",
                                  user,
                                  temperature = 1,
                                  model = "gpt-4o-mini",
                              }: LLMResponseParams): Promise<string> {
    const completion = await openai.chat.completions.create({
        model,
        temperature,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
    });
    return completion.choices[0].message.content || '';
}