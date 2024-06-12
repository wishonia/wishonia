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
        const globalProblems = await prisma.globalProblem.findUnique({
            where: {
                id: globalProblemId
            }
        });
        return new Response(JSON.stringify(globalProblems))
    } catch (error) {
        return handleError(error);
    }
}