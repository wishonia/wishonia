import { z } from 'zod';
import { handleError } from '@/lib/errorHandler';
import {dfdaGET, dfdaPOST} from '@/lib/dfda';
import {getUserIdServer} from "@/lib/api/getUserIdServer";

const routeContextSchema = z.object({
  params: z.object({
    dfdaPath: z.string(),
  }),
})

export async function GET(req: Request, context: z.infer<typeof routeContextSchema>) {
  const { params } = routeContextSchema.parse(context);
  const urlParams = Object.fromEntries(new URL(req.url).searchParams);
  const userId = await getUserIdServer()
  try {
    const response = await dfdaGET(params.dfdaPath, urlParams, userId);
    const data = response.data ?? response;
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return handleError(error, "GET dfdaPath");
  }
}

export async function POST(req: Request, context: z.infer<typeof routeContextSchema>) {
  const { params } = routeContextSchema.parse(context);
  const urlParams = Object.fromEntries(new URL(req.url).searchParams);
  const body = await req.json();
  const userId = await getUserIdServer()
  try {
    const response = await dfdaPOST(params.dfdaPath, body, userId, urlParams);
    const data = response.data ?? response;
    return new Response(JSON.stringify(data), { status: response.status, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return handleError(error, "POST dfdaPath");
  }
}
