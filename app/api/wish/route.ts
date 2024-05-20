import * as z from "zod"
import {getUserId} from "@/lib/api/getUserId";
import {handleError} from "@/lib/errorHandler";
import {saveWishToWishingWell} from "@/lib/wishingWells";

const wishingWellCreateSchema = z.object({
  wish: z.string()
})

export async function POST(req: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = wishingWellCreateSchema.parse(json)
    const wish = body.wish
    const wishingWell = await saveWishToWishingWell(wish, userId);
    return new Response(JSON.stringify(wishingWell))
  } catch (error) {
    return handleError(error)
  }
}
