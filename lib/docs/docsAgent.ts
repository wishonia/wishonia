import {codeBlock, oneLine} from 'common-tags';
import GPT3Tokenizer from 'gpt3-tokenizer';
import {ChatCompletionRequestMessage, CreateEmbeddingResponse, CreateModerationResponse,} from 'openai-edge';
import {OpenAIStream, StreamingTextResponse} from 'ai';
import {ApplicationError, UserError} from "@/lib/errorHandler";
import {getOpenaiClient} from "@/lib/openaiClient";
import {getSupabaseClient} from "@/lib/supabaseClient";


export async function moderateContent(query: string): Promise<void> {
    const sanitizedQuery = query.trim();
    const openai = getOpenaiClient();
    const moderationResponse: CreateModerationResponse = await openai
        .createModeration({ input: sanitizedQuery })
        .then((res) => res.json());

    const [results] = moderationResponse.results;

    if (results.flagged) {
        throw new UserError('Flagged content', {
            flagged: true,
            categories: results.categories,
        });
    }
}

export async function createEmbedding(query: string): Promise<number[]> {
    const openai = getOpenaiClient();
    const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: query.replaceAll('\n', ' '),
    });

    if (embeddingResponse.status !== 200) {
        throw new ApplicationError('Failed to create embedding for question', embeddingResponse);
    }

    const {
        data: [{ embedding }],
    }: CreateEmbeddingResponse = await embeddingResponse.json();

    return embedding;
}

export async function matchPageSections(
    embedding: number[],
    matchThreshold = 0.78,
    matchCount = 10,
    minContentLength = 50
) {
    const supabaseClient = getSupabaseClient();
    const { error: matchError, data: pageSections } = await supabaseClient.rpc(
        'match_page_sections', {
        embedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
        min_content_length: minContentLength,
    });

    if (matchError) {
        throw new ApplicationError('Failed to match page sections', matchError);
    }

    return pageSections;
}

export function extractContextText(pageSections: any[], maxTokens = 1500) {
    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
    let tokenCount = 0;
    let contextText = '';

    for (let i = 0; i < pageSections.length; i++) {
        const pageSection = pageSections[i];
        const content = pageSection.content;
        const encoded = tokenizer.encode(content);
        tokenCount += encoded.text.length;

        if (tokenCount >= maxTokens) {
            break;
        }

        contextText += `${content.trim()}\n---\n`;
    }

    return contextText;
}

async function getPaths(pageSections: { page_id: any; }[]) {
    const pageIds = new Set(pageSections.map((section: { page_id: any; }) => section.page_id));
    // Fetch paths for each page_id
    let paths = await getSupabaseClient()
        .from('page')
        .select('path')
        .in('id', Array.from(pageIds))
        .then(response => response.data?.map(page => page.path));

    if (!paths) {
        paths = [];
    }
    return paths;
}

export async function askSupabase(query: string, streaming: boolean) {


    await moderateContent(query);
    const embedding = await createEmbedding(query);
    const pageSections = await matchPageSections(embedding);
    const paths = await getPaths(pageSections);
    const contextText = extractContextText(pageSections);

    const prompt = codeBlock`
    ${oneLine`
      You are the king of Wishonia! Given the following sections from the Wishonia
      documentation, answer the question using only that information,
      outputted in markdown format. If you are unsure and the answer
      is not explicitly written in the documentation, say
      "Sorry, I don't know how to help with that. 
       <u>[👉 Please Click Here to Ask a Human](https://github.com/wishonia/wishonia/issues).</u>"
    `}

    Context sections:
    ${contextText}

    Question: """
    ${query}
    """

    Answer as markdown (including related code snippets if available):
  `;

    const chatMessage: ChatCompletionRequestMessage = {
        role: 'user',
        content: prompt,
    };

    const openai = getOpenaiClient();
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [chatMessage],
        max_tokens: 512,
        temperature: 0,
        stream: streaming,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new ApplicationError('Failed to generate completion', error);
    }

    if(!streaming) {
        const obj = await response.json();
        const str = obj.choices[0].message.content;
        const possiblePrefixes = ['Answer:**', 'Answer:', 'Answer'];
        let stripped = str;
        for (const prefix of possiblePrefixes) {
            if(str.indexOf(prefix) !== -1) {
                stripped = str.substring(str.indexOf(prefix) + prefix.length).trim();
                return stripped;
            }
        }
        return stripped;
    }

    const openAIStream = OpenAIStream(response);

    // Process the stream and append links
    const transformedStream = new TransformStream({
        async transform(chunk, controller) {
            let transformedText = new TextDecoder().decode(chunk);

            // Append links to the relevant paths
            for (const path of paths) {
                transformedText += `\n[${path}](${path})`;
            }

            controller.enqueue(new TextEncoder().encode(transformedText));
        },
    });

    return new StreamingTextResponse(openAIStream);

    //return new StreamingTextResponse(stream.pipeThrough(transformedStream));
}