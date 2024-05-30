import { PrismaClient, AiModels } from "@prisma/client";
import { getSettings } from "./common";
import { cleanUrl, getAllOllamaModels } from "./ollama";
import { v4 as uuidv4 } from 'uuid';
export const getModelInfo = async ({
  model,
  prisma,
  type = "all",
}: {
  prisma: PrismaClient;
  model: string;
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
        modelId: model,
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
            modelId: model,
          },
          {
            modelId: `${model}-dbase`,
          },
        ],
      },
    });
  } else if (type === "embedding") {
    modelInfo = await prisma.aiModels.findFirst({
      where: {
        OR: [
          {
            modelId: model,
          },
          {
            modelId: `wishonia_eb_${model}`,
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
      const ollamaModles = await getAllOllamaModels(settings.ollamaURL);
      const ollamaInfo = ollamaModles.find((m) => m.value === model);
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
