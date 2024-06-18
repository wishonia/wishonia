"use client";
import React, {FC} from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Script from "next/script";

interface MarkdownRendererProps {
    name: string;
    description: string | null;
    featuredImage: string | null;
    content: string | null;
}

const MarkdownRenderer: FC<MarkdownRendererProps> = ({name,
                                                         description,
                                                         content,
                                                         featuredImage}) => {

    const replaceMermaidSyntax = (markdownContent: string): string => {
        const mermaidRegex = /mermaid([^`]*)/g;
        return markdownContent.replace(mermaidRegex, (match, mermaidContent) => {
            return `<pre class="mermaid bg-white flex justify-center">${mermaidContent.trim()}</pre>`;
        });
    };
    if(content){content = replaceMermaidSyntax(content);}
    if(!content){
        throw new Error("Content is null");
    }
    return (
        <div className="text-left">
            <>
                <div className="metadata">
                    {name && <h1 className="text-3xl mb-4 mt-4 font-bold">{name}</h1>}
                    {description && <p className="mb-4">{description}</p>}
                    {featuredImage &&
                        <img src={featuredImage} alt="Cover Image" className="mb-4"/>}
                </div>
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
        </div>
    );
};

export default MarkdownRenderer;