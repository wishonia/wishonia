import {ApplicationError, UserError} from "@/lib/errorHandler";
import {askSupabase} from "@/lib/docs/docsAgent";

export const runtime = 'edge'

export async function POST(
    req: Request
) {
  try {


    const requestData = await req.json()

    if (!requestData) {
      throw new UserError('Missing request data')
    }

    const { prompt: query } = requestData

    if (!query) {
      throw new UserError('Missing query in request data')
    }

    const sanitizedQuery = query.trim()
    // Return a StreamingTextResponse, which can be consumed by the client
    return await askSupabase(sanitizedQuery, true)
  } catch (err: unknown) {
    if (err instanceof UserError) {
      return new Response(
          JSON.stringify({
            error: err.message,
            data: err.data,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
      )
    } else if (err instanceof ApplicationError) {
      // Print out application errors with their additional data
      console.error(`${err.message}: ${JSON.stringify(err.data)}`)
    } else {
      // Print out unexpected errors as is to help with debugging
      console.error(err)
    }

    // TODO: include more response info in debug environments
    return new Response(
        JSON.stringify({
          error: 'There was an error processing your request',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
    )
  }
}
