-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "noOfDocumentsToRetrieve" INTEGER DEFAULT 4,
    "noOfChatHistoryInContext" INTEGER DEFAULT 15,
    "semanticSearchSimilarityScore" TEXT DEFAULT 'none',
    "model" TEXT NOT NULL DEFAULT 'gpt-3.5-turbo',
    "provider" TEXT NOT NULL DEFAULT 'openai',
    "embedding" TEXT NOT NULL DEFAULT 'openai',
    "streaming" BOOLEAN NOT NULL DEFAULT false,
    "showRef" BOOLEAN NOT NULL DEFAULT false,
    "questionGeneratorPrompt" TEXT NOT NULL DEFAULT 'Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.   Chat History: {chat_history} Follow Up Input: {question} Standalone question:',
    "qaPrompt" TEXT NOT NULL DEFAULT 'You are a helpful AI assistant. Use the following pieces of context to answer the question at the end. If you don''t know the answer, just say you don''t know. DO NOT try to make up an answer. If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.  {context}  Question: {question} Helpful answer in markdown:',
    "voiceToTextType" TEXT NOT NULL DEFAULT 'web_api',
    "textToVoiceEnabled" BOOLEAN NOT NULL DEFAULT false,
    "textToVoiceType" TEXT NOT NULL DEFAULT 'web_api',
    "textToVoiceTypeMetadata" JSON NOT NULL DEFAULT '{}',
    "useHybridSearch" BOOLEAN NOT NULL DEFAULT false,
    "haveDataSourcesBeenAdded" BOOLEAN NOT NULL DEFAULT false,
    "useRag" BOOLEAN NOT NULL DEFAULT false,
    "agentProtect" BOOLEAN NOT NULL DEFAULT false,
    "agentApiKey" TEXT,
    "agentModelApiKey" TEXT,
    "options" JSON DEFAULT '{}',

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentSource" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'website',
    "content" TEXT,
    "location" TEXT,
    "isPending" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "options" JSON,

    CONSTRAINT "AgentSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentDocument" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "AgentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" TEXT NOT NULL,
    "noOfAgentsPerUser" INTEGER NOT NULL DEFAULT 10,
    "allowUserToCreateAgents" BOOLEAN NOT NULL DEFAULT true,
    "allowUserToRegister" BOOLEAN NOT NULL DEFAULT false,
    "numberOfDocuments" INTEGER NOT NULL DEFAULT 10,
    "legacyMode" BOOLEAN NOT NULL DEFAULT false,
    "hidePlayground" BOOLEAN NOT NULL DEFAULT false,
    "defaultChunkSize" INTEGER DEFAULT 1000,
    "defaultChunkOverlap" INTEGER DEFAULT 200,
    "dynamicallyFetchOllamaModels" BOOLEAN DEFAULT false,
    "hideDefaultModels" BOOLEAN DEFAULT false,
    "defaultChatModel" TEXT NOT NULL DEFAULT 'gpt-3.5-turbo-dbase',
    "defaultEmbeddingModel" TEXT NOT NULL DEFAULT 'dialoqbase_eb_text-embedding-ada-002',
    "ollamaURL" TEXT DEFAULT 'http://host.docker.internal:11434',

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentIntegration" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "telegramAgentToken" TEXT,
    "isPause" BOOLEAN DEFAULT false,
    "discordAgentToken" TEXT,
    "discordSlashCommand" TEXT DEFAULT 'hey',
    "discordSlashCommandDescription" TEXT DEFAULT 'Use this command to get help',
    "discordApplicationId" TEXT,
    "whatsappAccessToken" TEXT,
    "discordShowSources" BOOLEAN DEFAULT false,
    "discordSmartLabel" BOOLEAN DEFAULT false,
    "whatsappVerifyToken" TEXT,
    "whatsappPhoneNumber" TEXT,
    "slackAuthToken" TEXT,
    "slackSigningSecret" TEXT,
    "slackAppToken" TEXT,

    CONSTRAINT "AgentIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentTelegramHistory" (
    "id" TEXT NOT NULL,
    "chatId" INTEGER,
    "newChatId" TEXT,
    "identifier" TEXT,
    "human" TEXT,
    "agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentTelegramHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentDiscordHistory" (
    "id" TEXT NOT NULL,
    "chatId" TEXT,
    "identifier" TEXT,
    "human" TEXT,
    "agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentDiscordHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentAppearance" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "firstMessage" TEXT NOT NULL,
    "backgroundColor" TEXT,
    "chatAgentBubbleStyle" JSON,
    "chatHumanBubbleStyle" JSON,
    "tts" BOOLEAN NOT NULL DEFAULT false,
    "ttsVoice" TEXT,
    "ttsProvider" TEXT,
    "ttsModel" TEXT,

    CONSTRAINT "AgentAppearance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentPlayground" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Chat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentPlayground_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentPlaygroundMessage" (
    "id" TEXT NOT NULL,
    "agentPlaygroundId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isAgent" BOOLEAN NOT NULL DEFAULT false,
    "sources" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentPlaygroundMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentWhatsappHistory" (
    "id" TEXT NOT NULL,
    "chatId" TEXT,
    "from" TEXT,
    "identifier" TEXT,
    "agentId" TEXT,
    "human" TEXT,
    "agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentWhatsappHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentWebHistory" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "metadata" JSONB,
    "sources" JSONB,
    "human" TEXT,
    "agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentWebHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiModels" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "modelId" TEXT NOT NULL,
    "modelType" TEXT NOT NULL DEFAULT 'chat',
    "streamAvailable" BOOLEAN NOT NULL DEFAULT false,
    "modelProvider" TEXT,
    "localModel" BOOLEAN NOT NULL DEFAULT false,
    "config" JSON NOT NULL DEFAULT '{}',
    "hide" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiModels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentApiHistory" (
    "id" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "agentId" TEXT,
    "human" TEXT,
    "agent" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentApiHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserApiKey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_publicId_key" ON "Agent"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "AiModels_modelId_key" ON "AiModels"("modelId");

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentSource" ADD CONSTRAINT "AgentSource_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentDocument" ADD CONSTRAINT "AgentDocument_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentDocument" ADD CONSTRAINT "AgentDocument_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "AgentSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentIntegration" ADD CONSTRAINT "AgentIntegration_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentAppearance" ADD CONSTRAINT "AgentAppearance_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentPlayground" ADD CONSTRAINT "AgentPlayground_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentPlaygroundMessage" ADD CONSTRAINT "AgentPlaygroundMessage_agentPlaygroundId_fkey" FOREIGN KEY ("agentPlaygroundId") REFERENCES "AgentPlayground"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApiKey" ADD CONSTRAINT "UserApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
