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
            }
        )
    } else {
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            {
                status: 500,
            }
        )
    }
}

export class ApplicationError extends Error {
    constructor(message: string, public data: Record<string, any> = {}) {
        super(message);
    }
}

export class UserError extends ApplicationError {}