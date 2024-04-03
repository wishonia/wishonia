"use client";
import { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { siteConfig } from '@/config/site'; // Adjust the path as necessary

const RemoteMdxLoader = ({ inputUrl }: { inputUrl: string }) => {
  const [mdxSource, setMdxSource] = useState('');

  useEffect(() => {
    const url = inputUrl.startsWith('http://') || inputUrl.startsWith('https://') ? 
        inputUrl : `${siteConfig.url.base}/${inputUrl}`;
        
    fetch(url)
      .then((res) => res.text()) // Assuming the endpoint returns MDX content directly
      .then((mdxContent) => {
        // Construct the base URL to include the path to the directory containing the MDX content
        const urlObject = new URL(url);
        urlObject.pathname = urlObject.pathname.replace(/\/[^\/]*$/, '/');
        const baseUrl = urlObject.toString();

        const updatedMdxContent = mdxContent.replace(/!\[([^\]]*)\]\((?!http)(.*?)\)/g, (match, altText, imagePath) => {
          // Ensure the imagePath does not start with a slash to correctly append it to the baseUrl
          const normalizedImagePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
          return `![${altText}](${baseUrl}${normalizedImagePath})`;
        });
        setMdxSource(updatedMdxContent);
      });
  }, [inputUrl]);

  return (
    <div>
      {mdxSource ? <MDXRemote source={mdxSource} /> : <p>Loading...</p>}
    </div>
  );
};

export default RemoteMdxLoader;
