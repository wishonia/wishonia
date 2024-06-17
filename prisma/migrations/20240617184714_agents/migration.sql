/*
  Warnings:

  - You are about to drop the column `agentApiKey` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `agentModelApiKey` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `agentProtect` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `embedding` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `haveDataSourcesBeenAdded` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `noOfChatHistoryInContext` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `noOfDocumentsToRetrieve` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `qaPrompt` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `questionGeneratorPrompt` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `semanticSearchSimilarityScore` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `showRef` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `streaming` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `textToVoiceEnabled` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `textToVoiceType` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `textToVoiceTypeMetadata` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `useHybridSearch` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `useRag` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `voiceToTextType` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the `AgentApiHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentAppearance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentDiscordHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentDocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentIntegration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentPlayground` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentPlaygroundMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentSource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentTelegramHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentWebHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentWhatsappHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AiModels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GlobalSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserApiKey` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Agent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Agent` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('SUPERAGENT', 'OPENAI_ASSISTANT', 'LLM');

-- CreateEnum
CREATE TYPE "LLMProvider" AS ENUM ('OPENAI', 'AZURE_OPENAI', 'HUGGINGFACE', 'PERPLEXITY', 'TOGETHER_AI', 'ANTHROPIC', 'BEDROCK', 'GROQ', 'MISTRAL', 'COHERE_CHAT');

-- CreateEnum
CREATE TYPE "LLMModel" AS ENUM ('GPT_3_5_TURBO', 'GPT_3_5_TURBO_16K_0613', 'GPT_3_5_TURBO_0613', 'GPT_3_5_TURBO_1106', 'GPT_3_5_TURBO_0125', 'GPT_4', 'GPT_4_0613', 'GPT_4_32K', 'GPT_4_32K_0613', 'GPT_4_1106_PREVIEW', 'GPT_4_0125_PREVIEW', 'GPT_4_TURBO', 'GPT_4_TURBO_PREVIEW', 'GPT_4_TURBO_2024_04_09', 'GPT_4_0', 'MISTRAL_7B_INSTRUCT_V01', 'MIXTRAL_8X7B_INSTRUCT_V01');

-- CreateEnum
CREATE TYPE "ToolType" AS ENUM ('ALGOLIA', 'BROWSER', 'BING_SEARCH', 'REPLICATE', 'WOLFRAM_ALPHA', 'ZAPIER_NLA', 'AGENT', 'OPENAPI', 'CHATGPT_PLUGIN', 'METAPHOR', 'PUBMED', 'CODE_EXECUTOR', 'OPENBB', 'GPT_VISION', 'TTS_1', 'HAND_OFF', 'FUNCTION', 'HTTP', 'SUPERRAG', 'RESEARCH', 'GITHUB', 'SCRAPER', 'ADVANCED_SCRAPER', 'GOOGLE_SEARCH', 'SEC');

-- CreateEnum
CREATE TYPE "DatasourceType" AS ENUM ('TXT', 'PDF', 'CSV', 'PPTX', 'XLSX', 'DOCX', 'GOOGLE_DOC', 'YOUTUBE', 'GITHUB_REPOSITORY', 'MARKDOWN', 'WEBPAGE', 'AIRTABLE', 'STRIPE', 'NOTION', 'SITEMAP', 'URL', 'FUNCTION');

-- CreateEnum
CREATE TYPE "DatasourceStatus" AS ENUM ('IN_PROGRESS', 'DONE', 'FAILED');

-- CreateEnum
CREATE TYPE "VectorDbProvider" AS ENUM ('PINECONE', 'ASTRA_DB', 'WEAVIATE', 'QDRANT', 'SUPABASE');

-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_userId_fkey";

-- DropForeignKey
ALTER TABLE "AgentAppearance" DROP CONSTRAINT "AgentAppearance_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentDocument" DROP CONSTRAINT "AgentDocument_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentDocument" DROP CONSTRAINT "AgentDocument_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "AgentIntegration" DROP CONSTRAINT "AgentIntegration_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentPlayground" DROP CONSTRAINT "AgentPlayground_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentPlaygroundMessage" DROP CONSTRAINT "AgentPlaygroundMessage_agentPlaygroundId_fkey";

-- DropForeignKey
ALTER TABLE "AgentSource" DROP CONSTRAINT "AgentSource_agentId_fkey";

-- DropForeignKey
ALTER TABLE "UserApiKey" DROP CONSTRAINT "UserApiKey_userId_fkey";

-- DropIndex
DROP INDEX "Agent_publicId_key";

-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "agentApiKey",
DROP COLUMN "agentModelApiKey",
DROP COLUMN "agentProtect",
DROP COLUMN "embedding",
DROP COLUMN "haveDataSourcesBeenAdded",
DROP COLUMN "model",
DROP COLUMN "noOfChatHistoryInContext",
DROP COLUMN "noOfDocumentsToRetrieve",
DROP COLUMN "options",
DROP COLUMN "provider",
DROP COLUMN "publicId",
DROP COLUMN "qaPrompt",
DROP COLUMN "questionGeneratorPrompt",
DROP COLUMN "semanticSearchSimilarityScore",
DROP COLUMN "showRef",
DROP COLUMN "streaming",
DROP COLUMN "temperature",
DROP COLUMN "textToVoiceEnabled",
DROP COLUMN "textToVoiceType",
DROP COLUMN "textToVoiceTypeMetadata",
DROP COLUMN "useHybridSearch",
DROP COLUMN "useRag",
DROP COLUMN "voiceToTextType",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "initialMessage" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "llmModel" "LLMModel" DEFAULT 'GPT_3_5_TURBO_16K_0613',
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "outputSchema" TEXT,
ADD COLUMN     "prompt" TEXT,
ADD COLUMN     "type" "AgentType" NOT NULL DEFAULT 'SUPERAGENT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT 'Add a agent description...';

-- DropTable
DROP TABLE "AgentApiHistory";

-- DropTable
DROP TABLE "AgentAppearance";

-- DropTable
DROP TABLE "AgentDiscordHistory";

-- DropTable
DROP TABLE "AgentDocument";

-- DropTable
DROP TABLE "AgentIntegration";

-- DropTable
DROP TABLE "AgentPlayground";

-- DropTable
DROP TABLE "AgentPlaygroundMessage";

-- DropTable
DROP TABLE "AgentSource";

-- DropTable
DROP TABLE "AgentTelegramHistory";

-- DropTable
DROP TABLE "AgentWebHistory";

-- DropTable
DROP TABLE "AgentWhatsappHistory";

-- DropTable
DROP TABLE "AiModels";

-- DropTable
DROP TABLE "GlobalSettings";

-- DropTable
DROP TABLE "UserApiKey";

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayApiKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Datasource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "description" TEXT,
    "url" TEXT,
    "type" "DatasourceType" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" TEXT,
    "status" "DatasourceStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "vectorDbId" TEXT,

    CONSTRAINT "Datasource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentDatasource" (
    "agentId" TEXT NOT NULL,
    "datasourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentDatasource_pkey" PRIMARY KEY ("agentId","datasourceId")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ToolType" NOT NULL,
    "returnDirect" BOOLEAN NOT NULL DEFAULT false,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "toolConfig" JSONB,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentTool" (
    "agentId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentTool_pkey" PRIMARY KEY ("agentId","toolId")
);

-- CreateTable
CREATE TABLE "LLM" (
    "id" TEXT NOT NULL,
    "provider" "LLMProvider" NOT NULL DEFAULT 'OPENAI',
    "apiKey" TEXT NOT NULL,
    "options" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LLM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentLLM" (
    "agentId" TEXT NOT NULL,
    "llmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentLLM_pkey" PRIMARY KEY ("agentId","llmId")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowConfig" (
    "id" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workflowId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "WorkflowConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowStep" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "workflowId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "input" TEXT,
    "output" TEXT,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "WorkflowStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VectorDb" (
    "id" TEXT NOT NULL,
    "provider" "VectorDbProvider" NOT NULL DEFAULT 'PINECONE',
    "options" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VectorDb_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "api_user_id" ON "ApiKey"("userId");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Datasource" ADD CONSTRAINT "Datasource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Datasource" ADD CONSTRAINT "Datasource_vectorDbId_fkey" FOREIGN KEY ("vectorDbId") REFERENCES "VectorDb"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentDatasource" ADD CONSTRAINT "AgentDatasource_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentDatasource" ADD CONSTRAINT "AgentDatasource_datasourceId_fkey" FOREIGN KEY ("datasourceId") REFERENCES "Datasource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentTool" ADD CONSTRAINT "AgentTool_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentTool" ADD CONSTRAINT "AgentTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LLM" ADD CONSTRAINT "LLM_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLLM" ADD CONSTRAINT "AgentLLM_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLLM" ADD CONSTRAINT "AgentLLM_llmId_fkey" FOREIGN KEY ("llmId") REFERENCES "LLM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowConfig" ADD CONSTRAINT "WorkflowConfig_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowConfig" ADD CONSTRAINT "WorkflowConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VectorDb" ADD CONSTRAINT "VectorDb_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
