import { prisma } from "@/lib/db";
import {handleError} from "@/lib/errorHandler";
import * as z from "zod";
import {deleteGlobalProblemSolutionById} from "@/lib/globalProblemSolutions";
import {isAdmin} from "@/lib/session";

const routeContextSchema = z.object({
    params: z.object({
        globalProblemSolutionId: z.string(),
    }),
})

export async function GET(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        const { params } = routeContextSchema.parse(context)
        const globalProblemId = params.globalProblemSolutionId;
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

export async function DELETE(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {

    if (!isAdmin) {
        return new Response("Unauthorized", { status: 401 });
    }
    try {
        const { params } = routeContextSchema.parse(context)
        const globalProblemSolutionId = params.globalProblemSolutionId;
        const result = await deleteGlobalProblemSolutionById(globalProblemSolutionId);
        return new Response(`Deleted global problem solution with id ${globalProblemSolutionId}`);
    } catch (error) {
        return handleError(error);
    }
}