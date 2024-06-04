import sharp from "sharp";
import fetch from "node-fetch";
import fs from "fs-extra";
import {openai, textCompletion} from "@/lib/llm";
import {uploadImageToVercel} from "@/lib/imageUploader";

interface GenerateImageOptions {
    prompt: string;
    amount?: number;
    resolution?: "512x512" | "256x256" | "1024x1024" | "1792x1024" | "1024x1792" | null | undefined;
}

export async function generateImage(body: GenerateImageOptions, model: string = "dall-e-3"): Promise<any> {
    let { prompt, amount = 1, resolution = "512x512" } = body;

    if (!process.env.OPENAI_API_KEY) {
        throw Error("OpenAI API Key not configured.");
    }

    if (!prompt) {
        throw Error("Prompt is required");
    }

    // Define the maximum length for each model
    const maxLength = model === "dall-e-2" ? 1000 : 3500;

    // Check if the prompt exceeds the maximum length
    if (prompt.length > maxLength) {
        console.warn(`Prompt exceeds the maximum length for ${model}. It will be truncated.`);
        prompt = prompt.substring(0, maxLength);
    }

    const response = await openai.images.generate({
        model,
        prompt,
        n: amount || 1,
        size: resolution || "512x512"
    });

    return response.data[0];
}

export async function generateFeaturedImage(content: string): Promise<Buffer> {
    const prePrompt = `full width image for an article on ${content}. 
    Requirements: 
    1. THE IMAGE SHOULD NOT CONTAIN ANY TEXT! 
    2. Use a colorful 16-bit style.`;
    console.log(`Generating image for content:
     ${content}`)
    const generatedPrompt = await textCompletion(
        `Generate an detailed prompt description for an AI image generator to generate an ${prePrompt} `,
        "text");
    //console.log(generatedPrompt)
    const response = await generateImage({
        prompt: prePrompt,
        resolution: "1792x1024",
        amount: 1
    });
    const imageUrl = response.url;
    const image = await fetch(imageUrl);
    return await image.buffer();
}

async function generateAndSaveFeaturedImagePng(content: string, imagePath: string): Promise<string> {
    // replace extensions with png
    imagePath = imagePath.replace(/\.[^/.]+$/, ".png");
    const buffer = await generateFeaturedImage(content);
    console.log(`Saving image to ${imagePath}`);
    await fs.writeFile(imagePath, buffer);
    return imagePath;
}

export async function generateAndSaveFeaturedImageJpg(content: string, imagePath: string): Promise<string> {

    const pngPath = imagePath.replace(/\.[^/.]+$/, ".png");
    if(!fs.existsSync(pngPath)) {
        await generateAndSaveFeaturedImagePng(content, pngPath);
    } else {
        console.log(`Image already exists at ${pngPath}`);
    }
    const jpgPath = pngPath.replace('.png', '.jpg');
    if(fs.existsSync(jpgPath)) {
        await fs.unlink(pngPath);
        console.log(`JPG image already exists at ${jpgPath}`);
        return jpgPath;
    }
    await sharp(pngPath)
        .jpeg({ quality: 50 })
        .toFile(jpgPath);
    await fs.unlink(pngPath);
    return await uploadImageToVercel(fs.readFileSync(jpgPath), jpgPath);
}

