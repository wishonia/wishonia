import { MDXRemote } from 'next-mdx-remote/rsc'
import { siteConfig } from '@/config/site' // Adjust the path as necessary

export default async function RemoteMdxPage() {
    // MDX text - can be from a local file, database, CMS, fetch, anywhere...
    let input = `${siteConfig.url.base}/treaty/cost-of-war.md`;
    const res = await fetch(input) // Example usage

    const markdown = await res.text()

    return <MDXRemote source={markdown} />
}