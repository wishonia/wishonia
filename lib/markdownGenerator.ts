import { writeFileSync } from "fs";
import { stringify } from "gray-matter";
import { textCompletion } from "@/lib/llm";
import {generateAndSaveFeaturedImageJpg} from "@/lib/imageGenerator";
import {convertToRelativePath} from "@/lib/fileHelper";
import {Post} from "@/interfaces/post";

export async function saveMarkdownPost(
    post: Post
): Promise<void> {
    if(post.featuredImage){post.featuredImage = convertToRelativePath(post.featuredImage);}
    const content = post.content;
    const metadata = JSON.parse(JSON.stringify(post));
    delete metadata.absFilePath;
    delete metadata.content;
    const postContent = stringify(content, metadata);
    writeFileSync(post.absFilePath, postContent);
    console.log(`Post saved to ${post.absFilePath}`);
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
    const post = {
        name: name,
        description: description,
        content: content,
        featuredImage: jpgPath,
        absFilePath: postPath
    } as Post;
    return saveMarkdownPost(post);
}