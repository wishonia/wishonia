import OpenAI from 'openai';
// Create an OpenAI API client (that's edge-friendly!)
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});
let model = process.env.OPENAI_MODEL || 'gpt-4o';

export async function textCompletion(promptText: string, returnType: "text" | "json_object"): Promise<string> {

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: model,
    stream: false,
    //max_tokens: 150,
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant`
      },
      {
        role: "user", // user = the dFDA app
        content: promptText
      },

    ],
    response_format: { type: returnType },
  });

  if(!response.choices[0].message.content) {
    throw new Error('No content in response');
  }

  return response.choices[0].message.content;
}

export async function jsonArrayCompletion(promptText: string): Promise<string[]> {
  const response =  await textCompletion(`Return a json array containing ${promptText}`,
    "json_object");
  const arr = JSON.parse(response);
  if (!Array.isArray(arr)) {
    throw new Error('Response is not an array');
  }
  return arr;
}
