// Sentry reports only from production deployments that upload source maps,
// the same condition next.config.js uses to add the Sentry build plugin.
export async function register() {
  if (
    !process.env.SENTRY_AUTH_TOKEN ||
    process.env.VERCEL_ENV !== "production"
  ) {
    return
  }
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config")
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config")
  }
}
