import OpenAI from 'openai';
// Create an OpenAI API client (that's edge-friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function textCompletion(promptText: string, returnType: "text" | "json_object"): Promise<string> {

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    stream: false,
    //max_tokens: 150,
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that translates user requests into JSON objects`
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
