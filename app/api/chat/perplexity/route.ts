import { OpenAIStream, StreamingTextResponse } from 'ai';

import { perplexity } from '@/lib/chat/perplexity';

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    // Request the OpenAI-compatible API for the response based on the prompt
    const response = await perplexity.chat.completions.create({
        model: 'llama-3.1-sonar-huge-128k-online',
        stream: true,
        messages: messages,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
}