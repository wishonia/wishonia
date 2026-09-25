// Initializes Sentry in the browser. The Sentry build plugin in
// next.config.js adds this file to production builds.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://5f75ae1f23ea666edacb0fd9e2102016@o926849.ingest.us.sentry.io/4507456052985856",

  // Trace 10% of page loads. Errors are always reported.
  tracesSampleRate: 0.1,

  debug: false,

  // Record no ordinary sessions, and a replay for 10% of sessions that hit
  // an error.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
