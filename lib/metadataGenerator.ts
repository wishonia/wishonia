import { join } from "path";
import dotenv from "dotenv";
import {textCompletion} from "@/lib/llm";
import {MarkdownFile} from "@/interfaces/markdownFile";
import {readAllMarkdownFiles} from "@/lib/markdownReader";
import {generateAndSaveFeaturedImageJpg} from "@/lib/imageGenerator";
import {saveMarkdownPost} from "@/lib/markdownGenerator";
import {absPathFromPublic} from "@/lib/fileHelper";
import fs from "fs";
dotenv.config({ path: join(__dirname, "../.env") });
async function generateMetadataFromContent(content: string): Promise<MarkdownFile> {
    const name = await generateTitleFromContent(content);
    const description = await generateDescriptionFromContent(content);
    return {
        name: name,
        description: description,
        content: content
    } as MarkdownFile;
}

async function generateTitleFromContent(content: string): Promise<string> {
    let text = await textCompletion(
        `Generate title for a blog post given the following content.  
        Make sure it's a single string less than 64 characters.
        DO NOT RETURN JSON!
        Here's the content to base the title on:
        
        \n\n${content}\n\n`,
        "text");
    text = text.replace(/"/g, "");
    return text;
}

async function generateDescriptionFromContent(content: string): Promise<string> {
    let text = await textCompletion(
        `Generate description for a blog post given the following content:
        Make sure it's a single string less than 240 characters.
        DO NOT RETURN JSON!
        Here's the content to base the title on:
        
        \n\n${content}\n\n`,
        "text");
    text = text.replace(/"/g, "");
    return text;
}

export async function generateMetadataWhereMissing(pathRelativeToPublic?: string): Promise<MarkdownFile[]> {
    const absFolderPath = absPathFromPublic(pathRelativeToPublic);
    const posts = await readAllMarkdownFiles(absFolderPath);
    for(const post of posts) {
        let updated = false;
        if(!post.name){
            post.name = await generateTitleFromContent(post.content);
            updated = true;
        }
        if(!post.description){
            post.description = await generateDescriptionFromContent(post.content);
            updated = true;
        }
        if(!post.featuredImage) {
            post.featuredImage = await generateAndSaveFeaturedImageJpg(post.content, post.absFilePath);
            updated = true;
        } else {
            const absPath = absPathFromPublic(post.featuredImage);
            const imageExists = fs.existsSync(absPath);
            if(!imageExists || post.featuredImage.endsWith('.png')){
                post.featuredImage = await generateAndSaveFeaturedImageJpg(post.content, post.absFilePath);
                updated = true;
            }
        }
        if(updated){
            await saveMarkdownPost(post);
        }

    }
    return posts;
}
