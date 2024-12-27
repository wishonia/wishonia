import { anthropic } from '@ai-sdk/anthropic';
import {google} from "@ai-sdk/google";
import {openai} from "@ai-sdk/openai";
// Available AI models
// https://sdk.vercel.ai/providers/ai-sdk-providers
export const aiModels = {
    'structuring-model': openai('gpt-4o-2024-08-06', {
        structuredOutputs: true, // $0.0025	$0.01 / 1k tokens
    }),
    'cheap-model': openai('gpt-4o-mini'), // $0.00015	$0.0006 / 1k tokens / 20X cheaper than Claude 3.5 Sonnet
    'smart-model': anthropic('claude-3-5-sonnet-20240620'), // $0.003 $0.015 / 1k tokens
    'gemini-pro': google('gemini-1.5-pro-latest', { // $0.007    | $0.021 / 1k tokens
        safetySettings: [
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        ],
    })
} as const;