import { Agent} from "@prisma/client"
import { prisma as db } from "@/lib/db"



// Fetch agent
export async function getAgent(
    agentId: Agent["id"],
) {
  return db.agent.findFirst({
    where: {
      id: agentId,
    },
  });
}