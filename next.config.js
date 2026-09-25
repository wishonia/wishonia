const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /@opentelemetry\/instrumentation/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
      {
        module: /require-in-the-middle/,
        message:
          /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
      },
    ]

    return config
  },
  // Type checking and linting are run as separate, sequential steps by the
  // `build` script instead of here. `next build` forks a worker for them while
  // the parent process still holds the whole webpack heap, and with
  // --max-old-space-size=4096 on both processes that exceeds the 8 GB Vercel
  // build container and gets SIGKILLed. Running them before the compile keeps
  // peak memory at max(check, compile) rather than the sum.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // The dFDA and DIH sections moved to their own sites.
  async redirects() {
    const cureAccelerationAct = 'https://www.crowdsourcingcures.org/cure-acceleration-act'
    return [
      { source: '/dfda/docs/cure-acceleration-act', destination: cureAccelerationAct, permanent: true },
      { source: '/dfda/cure-acceleration-act', destination: cureAccelerationAct, permanent: true },
      { source: '/dfda/right-to-trial', destination: cureAccelerationAct, permanent: true },
      { source: '/dfda/right-to-trial-act', destination: cureAccelerationAct, permanent: true },
      { source: '/dfda/:path*', destination: 'https://dfda.earth', permanent: true },
      { source: '/dih/:path*', destination: 'https://dih.earth', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ]
  }
}

// Wrap nextConfig with withBundleAnalyzer
let config = withBundleAnalyzer(nextConfig)

const shouldUploadSentrySourceMaps =
  process.env.SENTRY_AUTH_TOKEN && process.env.VERCEL_ENV === "production"

if (!shouldUploadSentrySourceMaps) {
  module.exports = config
} else {
  const { withSentryConfig } = require("@sentry/nextjs");

  // Wrap the bundle analyzer config with Sentry
  module.exports = withSentryConfig(
    config,
    {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      org: "wishonia-org",
      project: "wishonia-project",

      // Keep CI logs focused on actionable build output.
      silent: true,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Avoid widening uploads: this app's bundle is large enough to exhaust
      // Vercel build resources during source-map processing.
      widenClientFileUpload: false,

      // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      // tunnelRoute: "/monitoring",

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      webpack: {
        // Automatically tree-shake Sentry logger statements to reduce bundle size
        treeshake: { removeDebugLogging: true },

        // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
        // See the following for more information:
        // https://docs.sentry.io/product/crons/
        // https://vercel.com/docs/cron-jobs
        automaticVercelMonitors: true,
      },
    }
  );
}
