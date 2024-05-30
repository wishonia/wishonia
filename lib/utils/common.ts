import {PrismaClient} from "@prisma/client";

export const getSettings = (prisma: PrismaClient) => {
  const settings = prisma.globalSettings.findFirst();

  if (!settings) {
    return prisma.globalSettings.create({
      data: {
        allowUserToCreateAgents: true,
        allowUserToRegister: false,
        noOfAgentsPerUser: 10,
      },
    });
  }

  return settings;
};
