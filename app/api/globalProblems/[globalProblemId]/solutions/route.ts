import { prisma } from "@/lib/db";
import {handleError} from "@/lib/errorHandler";
import * as z from "zod";
const routeContextSchema = z.object({
  params: z.object({
    globalProblemId: z.string(),
  }),
})
export async function GET(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)
    const globalProblemId = params.globalProblemId;
    const globalProblemSolutions =
        await prisma.globalProblemSolution.findMany({
            where: {
                globalProblemId: globalProblemId
            },
            include: {
                globalProblem: true,
                globalSolution: true
            }
        });
    return new Response(JSON.stringify(globalProblemSolutions))
  } catch (error) {
    return handleError(error);
  }
}