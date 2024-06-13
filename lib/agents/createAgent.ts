import {getModelInfo} from "@/lib/utils/get-model-info";
import {prisma} from "@/lib/db";
import {HELPFUL_ASSISTANT_WITH_CONTEXT_PROMPT, QUESTION_GENERATOR_PROMPT} from
        "@/lib/utils/prompts";

export async function createAgent(userId: string, name: string, chatModelId?: string, embeddingModelId?: string){
    chatModelId = chatModelId || "wishonia_eb_text-embedding-ada-002";
    embeddingModelId = embeddingModelId || "gpt-3.5-turbo-dbase";
    const modelInfo = await getModelInfo({
        modelId: chatModelId,
        prisma,
        type: "chat",
    });
    
    if(!modelInfo){
        throw new Error(`Model not found for ${chatModelId}`);
    }

    const embeddingInfo = await getModelInfo({
        modelId: embeddingModelId,
        prisma,
        type: "embedding",
    });
    if(!embeddingInfo){
        throw new Error(`Embedding not found for ${embeddingModelId}`);
    }

    if(!modelInfo.modelProvider){
        throw new Error(`Model provider not found for ${chatModelId}`);
    }

    return prisma.agent.create({
        data: {
            name,
            embedding: embeddingInfo.modelId,
            model: modelInfo.modelId,
            provider: modelInfo.modelProvider,
            streaming:  modelInfo.streamAvailable,
            userId: userId,
            temperature: 0.7,
            qaPrompt: HELPFUL_ASSISTANT_WITH_CONTEXT_PROMPT,
            questionGeneratorPrompt: QUESTION_GENERATOR_PROMPT,
        },
    });
}