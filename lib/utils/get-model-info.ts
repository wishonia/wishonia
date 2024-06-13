import { PrismaClient, AiModels } from "@prisma/client";
import { getSettings } from "./common";
import { cleanUrl, getAllOllamaModels } from "./ollama";
import { v4 as uuidv4 } from 'uuid';
export const getModelInfo = async ({
  modelId,
  prisma,
  type = "all",
}: {
  prisma: PrismaClient;
  modelId: string;
  type?: "all" | "chat" | "embedding";
}): Promise<AiModels | null> => {
  let modelInfo: AiModels | null = null;
  const settings = await getSettings(prisma);
  const not_to_hide_providers = settings?.hideDefaultModels
    ? [ "Local", "local", "ollama", "transformer", "Transformer"]
    : undefined;
  if (type === "all") {
    modelInfo = await prisma.aiModels.findFirst({
      where: {
        modelId,
        hide: false,
        deleted: false,
        modelProvider: {
          in: not_to_hide_providers,
        },
      },
    });
  } else if (type === "chat") {
    modelInfo = await prisma.aiModels.findFirst({
      where: {
        hide: false,
        deleted: false,
        modelProvider: {
          in: not_to_hide_providers,
        },
        OR: [
          {
            modelId,
          },
          {
            modelId: `${modelId}-dbase`,
          },
        ],
      },
    });
  } else if (type === "embedding") {
    modelInfo = await prisma.aiModels.findFirst({
      where: {
        OR: [
          {
            modelId,
          },
          {
            modelId: `wishonia_eb_${modelId}`,
          },
        ],
        hide: false,
        deleted: false,
        modelProvider: {
          in: not_to_hide_providers,
        },
      },
    });
  }
  if (!modelInfo) {
    if (settings?.dynamicallyFetchOllamaModels) {
      if(!settings.ollamaURL) {
        throw new Error("Ollama URL is not set");
      }
      const ollamaModels = await getAllOllamaModels(settings.ollamaURL);
      const ollamaInfo = ollamaModels.find((m) => m.value === modelId);
      if (ollamaInfo) {
        return {
          name: ollamaInfo.name,
          modelId: ollamaInfo.name,
          streamAvailable: true,
          localModel: true,
          modelProvider: "ollama",
          config: {
            baseURL: cleanUrl(settings.ollamaURL),
          },
          createdAt: new Date(),
          modelType: "chat",
          deleted: false,
          hide: false,
          id: uuidv4(),
        };
      }
    }
  }

  return modelInfo;
};
