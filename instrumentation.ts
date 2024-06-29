export async function register() {
  if (!process.env.SENTRY_AUTH_TOKEN) {
    console.debug(
      "SENTRY_AUTH_TOKEN is not set, skipping Sentry initialization"
    )
    return
  }
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config")
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config")
  }
}
