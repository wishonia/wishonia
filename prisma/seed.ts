import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const LLMS: {
    name: string;
    modelId: string;
    modelType: string;
    modelProvider?: string;
    streamAvailable?: boolean;
    localModel?: boolean;
    config?: string;
}[] = [
    {
        name: "GPT-3.5 Turbo (OpenAI)",
        modelId: "gpt-3.5-turbo-dbase",
        modelType: "chat",
        modelProvider: "OpenAI",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "GPT-3.5 Turbo 16K (OpenAI)",
        modelId: "gpt-3.5-turbo-16k-dbase",
        modelType: "chat",
        modelProvider: "OpenAI",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "GPT-4 (OpenAI)",
        modelId: "gpt-4-dbase",
        modelType: "chat",
        modelProvider: "OpenAI",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "GPT-4 0613 (OpenAI)",
        modelId: "gpt-4-0613-dbase",
        modelType: "chat",
        modelProvider: "OpenAI",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "GPT-3.5 Turbo Instruct (OpenAI)",
        modelId: "gpt-3.5-turbo-instruct-dbase",
        modelType: "instruct",
        modelProvider: "openai-instruct",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Claude 1 (Anthropic)",
        modelId: "claude-1-dbase",
        modelType: "chat",
        modelProvider: "Anthropic",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Claude 2 (Anthropic)",
        modelId: "claude-2-dbase",
        modelType: "chat",
        modelProvider: "Anthropic",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Claude Instant (Anthropic)",
        modelId: "claude-instant-1-dbase",
        modelType: "chat",
        modelProvider: "Anthropic",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Google chat-bison-001",
        modelId: "google-bison-dbase",
        modelType: "chat",
        modelProvider: "Google",
        streamAvailable: false,
        localModel: false,
        config: "{}",
    },
    {
        name: "Llama v2 7B (Fireworks)",
        modelId: "accounts/fireworks/models/llama-v2-7b-chat",
        modelType: "chat",
        modelProvider: "Fireworks",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Llama v2 13B (Fireworks)",
        modelId: "accounts/fireworks/models/llama-v2-13b-chat",
        modelType: "chat",
        modelProvider: "Fireworks",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Llama v2 70B (Fireworks)",
        modelId: "accounts/fireworks/models/llama-v2-70b-chat",
        modelType: "chat",
        modelProvider: "Fireworks",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Llama v2 7B Chat int8 (Fireworks)",
        modelId: "accounts/fireworks/models/llama-v2-7b-chat-w8a16",
        modelType: "chat",
        modelProvider: "Fireworks",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Llama v2 13B Chat int8 (Fireworks)",
        modelId: "accounts/fireworks/models/llama-v2-13b-chat-w8a16",
        modelType: "chat",
        modelProvider: "Fireworks",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Llama v2 13B Code Instruct (Fireworks)",
        modelId: "accounts/fireworks/models/llama-v2-13b-code-instruct",
        modelType: "instruct",
        modelProvider: "Fireworks",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Llama v2 34B Code Instruct int8 (Fireworks)",
        modelId: "accounts/fireworks/models/llama-v2-34b-code-instruct-w8a16",
        modelType: "instruct",
        modelProvider: "Fireworks",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Mistral 7B Instruct 4K (Fireworks)",
        modelId: "accounts/fireworks/models/mistral-7b-instruct-4k",
        modelType: "instruct",
        modelProvider: "Fireworks",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "GPT-3.5 Turbo 1106 (OpenAI)",
        modelId: "gpt-3.5-turbo-1106-dbase",
        modelType: "chat",
        modelProvider: "OpenAI",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "GPT-4 Turbo (OpenAI)",
        modelId: "gpt-4-1106-preview-dbase",
        modelType: "chat",
        modelProvider: "OpenAI",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "GPT-4 Turbo with vision (OpenAI)",
        modelId: "gpt-4-vision-preview-dbase",
        modelType: "chat",
        modelProvider: "OpenAI",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Claude 2.1 (Anthropic)",
        modelId: "claude-2.1-dbase",
        modelType: "chat",
        modelProvider: "Anthropic",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Claude Instant 1.2 (Anthropic)",
        modelId: "claude-instant-1.2-dbase",
        modelType: "chat",
        modelProvider: "Anthropic",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Yi 34B 200k (Fireworks)",
        modelId: "accounts/fireworks/models/yi-34b-200k",
        modelType: "instruct",
        streamAvailable: true,
        modelProvider: "Fireworks",
        localModel: false,
        config: "{}",
    },
    {
        modelId: "accounts/fireworks/models/yi-34b-200k-capybara",
        name: "Capybara 34B (Fireworks)",
        modelType: "chat",
        streamAvailable: true,
        modelProvider: "Fireworks",
        localModel: false,
        config: "{}",
    },
    {
        modelId: "accounts/fireworks/models/zephyr-7b-beta",
        name: "Zephyr 7B Beta (Fireworks)",
        modelType: "instruct",
        streamAvailable: true,
        modelProvider: "Fireworks",
        localModel: false,
        config: "{}",
    },
    {
        modelId: "accounts/fireworks/models/mixtral-8x7b-instruct",
        name: "Mixtral MoE 8x7B Instruct (Fireworks)",
        modelType: "instruct",
        streamAvailable: true,
        modelProvider: "Fireworks",
        localModel: false,
        config: "{}",
    },
    {
        modelId: "gemini-pro",
        name: "Gemini Pro (Google)",
        modelType: "chat",
        streamAvailable: true,
        modelProvider: "Google",
        localModel: false,
        config: "{}",
    },
    {
        modelId: "accounts/fireworks/models/qwen-72b-chat",
        name: "Qwen 72b chat (Fireworks)",
        modelType: "chat",
        streamAvailable: true,
        modelProvider: "Fireworks",
        localModel: false,
        config: "{}",
    },
    {
        modelId: "gpt-3.5-turbo-0125-dbase",
        name: "GPT-3.5 Turbo 0125 (OpenAI)",
        modelType: "chat",
        streamAvailable: true,
        modelProvider: "OpenAI",
        localModel: false,
        config: "{}",
    },
    {
        name: "Claude 3 Opus 20240229 (Anthropic)",
        modelId: "claude-3-opus-20240229-dbase",
        modelType: "chat",
        modelProvider: "Anthropic",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Claude 3 Sonnet 20240229 (Anthropic)",
        modelId: "claude-3-sonnet-20240229-dbase",
        modelType: "chat",
        modelProvider: "Anthropic",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "LLaMA2-70b (Groq)",
        modelId: "llama2-70b-4096-dbase",
        modelType: "chat",
        modelProvider: "Groq",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Mixtral-8x7b (Groq)",
        modelId: "mixtral-8x7b-32768-dbase",
        modelType: "chat",
        modelProvider: "Groq",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        name: "Gemma-7b-it (Groq)",
        modelId: "gemma-7b-it-dbase",
        modelType: "chat",
        modelProvider: "Groq",
        streamAvailable: true,
        localModel: false,
        config: "{}",
    },
    {
        modelId: "claude-3-haiku-20240307-dbase",
        name: "Claude 3 Haiku 20240307 (Anthropic)",
        modelType: "chat",
        streamAvailable: true,
        modelProvider: "Anthropic",
        localModel: false,
        config: "{}",
    },
    {
        modelId: "accounts/fireworks/models/llama-v3-70b-instruct-dbase",
        name: "Llama v3 70B Instruct (Fireworks)",
        modelType: "chat",
        streamAvailable: true,
        modelProvider: "Fireworks",
        localModel: false,
    },
    {
        modelId: "llama3-8b-8192-dbase",
        name: "LLaMA3-8b (Groq)",
        modelType: "chat",
        streamAvailable: true,
        modelProvider: "Groq",
    },
    {
        modelId: "llama3-70b-8192",
        name: "LLaMA3-70b (Groq)",
        modelType: "chat",
        streamAvailable: true,
        modelProvider: "Groq",
    },
    {
        modelId: "gpt-4o-dbase",
        name: "GPT-4o (OpenAI)",
        modelType: "chat",
        streamAvailable: true,
        modelProvider: "OpenAI",
        config: "{}",
    }
];

const EMBEDDING_MODELS: {
    name: string;
    modelId: string;
    modelType: string;
    modelProvider?: string;
    streamAvailable?: boolean;
    localModel?: boolean;
    config?: string;
}[] = [
    {
        modelId: "wishonia_eb_text-embedding-ada-002",
        name: "text-embedding-ada-002",
        modelProvider: "OpenAI",
        modelType: "embedding",
    },
    {
        modelId: "wishonia_eb_small",
        name: "Cohere",
        modelProvider: "Cohere",
        modelType: "embedding",
    },
    {
        modelId: "wishonia_eb_Xenova/all-MiniLM-L6-v2",
        name: "all-MiniLM-L6-v2 (cpu)",
        modelType: "embedding",
        modelProvider: "Transformer",
    },
    {
        modelId: "wishonia_eb_dialoqbase-ollama",
        name: "Ollama Embeddings",
        modelType: "embedding",
        modelProvider: "Ollama",
    },
    {
        modelId: "wishonia_eb_models/embedding-gecko-001",
        name: "Google text-gecko-001",
        modelType: "embedding",
        modelProvider: "Google PaLM",
    },
    {
        modelId: "wishonia_eb_jina-embeddings-v2-base-en",
        name: "jina-embeddings-v2-base-en (API)",
        modelType: "embedding",
        modelProvider: "Jina",
    },
    {
        modelId: "wishonia_eb_Xenova/jina-embeddings-v2-small-en",
        name: "jina-embeddings-v2-small-en (cpu)",
        modelType: "embedding",
        modelProvider: "Transformer",
    },
    {
        modelId: "wishonia_eb_embedding-001",
        name: "Google embedding-001",
        modelType: "embedding",
        modelProvider: "Google",
    },
    {
        modelId: "wishonia_eb_text-embedding-3-small",
        name: "text-embedding-3-small (OpenAI)",
        modelType: "embedding",
        modelProvider: "OpenAI",
    },
    {
        modelId: "wishonia_eb_text-embedding-3-large",
        name: "text-embedding-3-large (OpenAI)",
        modelType: "embedding",
        modelProvider: "OpenAI",
    },
    {
        modelProvider: "Fireworks",
        modelType: "embedding",
        modelId: "wishonia_eb_nomic-ai/nomic-embed-text-v1.5",
        name: "nomic-ai/nomic-embed-text-v1.5 (Fireworks)",
    },
];

const newModels = async () => {
    console.log("Seeding new models...");
    for (const model of LLMS) {
        await prisma.aiModels.upsert({
            where: {
                modelId: model.modelId,
            },
            update: {
                name: model.name,
            },
            create: model,
        });
    }

    for (const model of EMBEDDING_MODELS) {
        await prisma.aiModels.upsert({
            where: {
                modelId: model.modelId,
            },
            update: {
                name: model.name,
            },
            create: model,
        });
    }
};

const removeTensorflowSupport = async () => {
    await prisma.agent.updateMany({
        where: {
            embedding: "tensorflow",
        },
        data: {
            embedding: "transformer",
        },
    });
};

const replaceOldEmbeddings = async () => {
    await prisma.agent.updateMany({
        where: {
            embedding: "openai",
        },
        data: {
            embedding: "wishonia_eb_text-embedding-ada-002",
        },
    });

    await prisma.agent.updateMany({
        where: {
            embedding: "cohere",
        },
        data: {
            embedding: "wishonia_eb_small",
        },
    });

    await prisma.agent.updateMany({
        where: {
            embedding: "transformer",
        },
        data: {
            embedding: "wishonia_eb_Xenova/all-MiniLM-L6-v2",
        },
    });

    await prisma.agent.updateMany({
        where: {
            embedding: "google-gecko",
        },
        data: {
            embedding: "wishonia_eb_models/embedding-gecko-001",
        },
    });

    await prisma.agent.updateMany({
        where: {
            embedding: "jina-api",
        },
        data: {
            embedding: "wishonia_eb_jina-embeddings-v2-base-en",
        },
    });

    await prisma.agent.updateMany({
        where: {
            embedding: "jina",
        },
        data: {
            embedding: "wishonia_eb_Xenova/jina-embeddings-v2-small-en",
        },
    });

    await prisma.agent.updateMany({
        where: {
            embedding: "google",
        },
        data: {
            embedding: "wishonia_eb_embedding-001",
        },
    });
};

const updateGeminiStreamingToTrue = async () => {
    await prisma.aiModels.update({
        where: {
            modelId: "gemini-pro",
        },
        data: {
            streamAvailable: true,
        },
    });
};

const main = async () => {
    await newModels();
    await removeTensorflowSupport();
    await replaceOldEmbeddings();
    await updateGeminiStreamingToTrue();
};

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
