import { writeFileSync } from "fs";
import { stringify } from "gray-matter";
import { textCompletion } from "@/lib/llm";
import {generateAndSaveFeaturedImageJpg} from "@/lib/imageGenerator";
import {convertToRelativePath} from "@/lib/fileHelper";

interface PostMetadata {
    name: string;
    description: string;
    featuredImage: string;
}

export async function saveMarkdownPost(
    postPath: string,
    name: string,
    description: string,
    featuredImage: string,
    content: string
): Promise<void> {
    const relativeImagePath = convertToRelativePath(featuredImage);
    const postContent = stringify(content, { name, description, featuredImage: relativeImagePath });
    writeFileSync(postPath, postContent);
    console.log(`Post saved to ${postPath}`);
}

export async function generateMarkdownAndImageFromDescription(
    postPath: string,
    name: string,
    description: string,
    contentInstructions: string
): Promise<void> {
    let jpgPath = await generateAndSaveFeaturedImageJpg(description, postPath);
    jpgPath = convertToRelativePath(jpgPath);
    let content = await textCompletion(contentInstructions, "text");
    // if a Markdown code block wrapper with backticks like ```markdown is found,
    // extract the content between the backticks
    content = content.replace(/```markdown\n([\s\S]+?)\n```/g, "$1");
    const metaData: PostMetadata = { name, description, featuredImage: jpgPath };
    const markdownWithMetaString = stringify(content, metaData);
    writeFileSync(postPath, markdownWithMetaString);
    console.log(`Post saved to ${postPath}`);
}