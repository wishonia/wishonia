import {z} from "zod";

export function handleError(error: unknown, message?: string, meta?: any) {
    if (error instanceof z.ZodError) {
        return new Response(JSON.stringify(error.issues), {
            status: 422,
            headers: { "Content-Type": "application/json" },
        })
    }

    console.error(error, {
        message,
        meta,
    })

    if (process.env.NODE_ENV === "development") {
        debugger
        return new Response(
            JSON.stringify({ error: "Internal Server Error", details: {
                message,
                error,
                    meta,
                } }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        )
    } else {
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        )
    }
}