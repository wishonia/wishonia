// Initializes Sentry for edge code such as middleware. instrumentation.ts
// loads this file.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://5f75ae1f23ea666edacb0fd9e2102016@o926849.ingest.us.sentry.io/4507456052985856",

  // Trace 10% of requests. Errors are always reported.
  tracesSampleRate: 0.1,

  debug: false,
})
