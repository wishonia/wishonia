import { z } from "zod"

import { handleError } from "@/lib/errorHandler"

const requestBodySchema = z.object({
  email: z.string().email(),
  intended_url: z.string().url(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedBody = requestBodySchema.parse(body)
    const response = await
        fetch(`https://safe.dfda.earth/auth/passwordless-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: parsedBody.email,
        intended_url: parsedBody.intended_url,
        clientId: process.env.DFDA_CLIENT_ID,
        platform: "web",
      }),
    })

    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      debugger
      // If JSON parsing fails, try to read the response as text
      const errorText = await response.text();
      console.error("Error parsing JSON response:", parseError);
      console.error("Response text:", errorText);
      // Handle or rethrow the parse error as needed, possibly using the error text
      return handleError(new Error(errorText || "Error parsing JSON response in POST passwordless-login"), "Error parsing JSON response in POST passwordless-login");
    }
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return handleError(error, "POST passwordless-login")
  }
}
