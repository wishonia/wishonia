"use client";
import React, {useState, useEffect, FC} from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import rehypeRaw from 'rehype-raw';
import matter from 'gray-matter';
import Script from "next/script";
import Link from "next/link";
import {Button} from './ui/button';
import {siteConfig} from "@/config/site";
import {
    AiFillGithub
} from "react-icons/ai"
import {SpinningLoader} from "@/components/spinningLoader";

interface MarkdownRendererProps {
    url: string;
}

interface Metadata {
    name?: string;
    description?: string;
    featuredImage?: string;
    author?: {
        name?: string;
        picture?: string;
    };
    date?: string; // Ensure this matches the type you expect, e.g., string
}

const MarkdownFileRenderer: FC<MarkdownRendererProps> = ({url}) => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [metadata, setMetadata] = useState<Metadata | null>(null);

    const githubEditUrl = `${siteConfig.links.github}/edit/main/public${url}`;
    const folder = url.split('/').slice(0, -1).join('/');

    useEffect(() => {
        const fetchMarkdown = async () => {
            try {
                const response = await axios.get(url);
                // Use gray-matter to parse the markdown content and extract metadata
                const {data, content: markdownContent} = matter(response.data);
                setMetadata(data);
                let baseUrlForImages = process.env.NEXT_PUBLIC_APP_URL || '';
                if(folder){
                    baseUrlForImages += folder;
                }
                // Replace image links with absolute paths
                let updatedMarkdownContent = markdownContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, altText, url) => {
                    // Check if the URL is already an absolute path
                    if (url.startsWith('http://') || url.startsWith('https://')) {
                        return match; // Return the original string if it's an absolute URL
                    }
                    // Remove the .md suffix for relative URLs ending in .md
                    const updatedUrl = url.endsWith('.md') ? url.slice(0, -3) : url;
                    return `![${altText}](${baseUrlForImages}${updatedUrl.startsWith('/') ? '' : '/'}${updatedUrl})`;
                });
                const replaceMermaidSyntax = (markdownContent: string): string => {
                    const mermaidRegex = /mermaid([^`]*)/g;
                    return markdownContent.replace(mermaidRegex, (match, mermaidContent) => {
                        return `<pre class="mermaid bg-white flex justify-center">${mermaidContent.trim()}</pre>`;
                    });
                };
                updatedMarkdownContent = replaceMermaidSyntax(updatedMarkdownContent);

                setContent(updatedMarkdownContent);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching Markdown:', error);
                setIsLoading(false);
            }
        };

        fetchMarkdown();
    }, [url]);

    return (
        <div className="text-left">
            {isLoading ? (
                <SpinningLoader/>
            ) : (
                <>
                    {/* Conditionally render metadata if it exists */}
                    {metadata && (
                        <div className="metadata">
                            {metadata.name && <h1 className="text-3xl mb-4 mt-4 font-bold">{metadata.name}</h1>}
                            {metadata.author && (
                                <div className="author-info flex items-center mb-4">
                                    {/* Add a style attribute to limit the max-width */}
                                    {metadata.author.picture &&
                                        <img src={metadata.author.picture} alt="Author" className="rounded-full mr-4"
                                             style={{maxWidth: '40px'}}/>}
                                    <p>By {metadata.author.name}</p>
                                </div>
                            )}
                            {metadata.date &&
                                <p className="mb-4 text-gray-500">{new Date(metadata.date).toLocaleDateString()}</p>}
                            {metadata.description && <p className="mb-4">{metadata.description}</p>}
                            {metadata.featuredImage && <img src={metadata.featuredImage} alt="Cover Image" className="mb-4"/>}
                        </div>
                    )}
                    <ReactMarkdown
                        rehypePlugins={[rehypeRaw as any]}
                        components={{
                            p: ({node, ...props}) => <p className="mb-4" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-3xl mb-4 mt-4 font-bold" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-2xl mb-4 mt-4 font-bold" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-xl mb-4 mt-4 font-bold" {...props} />,
                            // Add custom rendering for lists
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                            li: ({node, ...props}) => <li className="mb-2" {...props} />,
                            // Ensure links are underlined
                            a: ({node, ...props}) => <a
                                className="underline text-blue-600 hover:text-blue-800" {...props} />,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                    <div className="flex items-center gap-x-2 justify-end">
                        <Link href={githubEditUrl} target={"_blank"}>
                            <Button variant="outline" className="rounded-full">
                                <AiFillGithub className="mr-2"></AiFillGithub>
                                Edit Me
                            </Button>
                        </Link>
                    </div>
                    <Script
                        type="module"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
        import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.esm.min.mjs";
        mermaid.initialize({startOnLoad: true});
        mermaid.contentLoaded();
`,
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default MarkdownFileRenderer;