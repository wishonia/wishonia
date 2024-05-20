/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      "intercontinental.com",
      "oaidalleapiprodscus.blob.core.windows.net",
      "cdn.openai.com",
      {
        protocol: 'https',
        hostname: 'wishonia-blob.public.blob.vercel-storage.com',
        port: '',
      },
    ]
  },
}

module.exports =  nextConfig
