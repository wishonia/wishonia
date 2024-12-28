import { anthropic } from '@ai-sdk/anthropic';
import {google} from "@ai-sdk/google";
import { createOpenAI } from '@ai-sdk/openai';
import { experimental_createProviderRegistry as createProviderRegistry } from 'ai';

export const registry = createProviderRegistry({
    // register provider with prefix and default setup:
    anthropic,

    // register provider with prefix and custom setup:
    openai: createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    }),
    google
});