import sharp from "sharp";
import fetch from "node-fetch";
import fs from "fs-extra";
import {openai} from "@/lib/llm";
import {uploadImageToVercel, vercelImageExists} from "@/lib/imageUploader";
import {relativePathFromPublic} from "@/lib/fileHelper";

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

export async function generateFeaturedImagePngBuffer(content: string): Promise<Buffer> {
    const prePrompt = `full width image for an article on ${content}. 
    Requirements: 
    1. THE IMAGE SHOULD NOT CONTAIN ANY TEXT! 
    2. Use a colorful 16-bit style.`;
    console.log(`Generating image for content:
     ${content}`)
    // const generatedPrompt = await textCompletion(
    //     `Generate a detailed prompt description for an AI image generator to generate an ${prePrompt} `,
    //     "text");
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

async function convertPngBufferToJpgBuffer(pngBuffer: Buffer): Promise<Buffer> {
    return await sharp(pngBuffer)
        .jpeg({quality: 50})
        .toBuffer();
}

export async function generateAndUploadFeaturedImageJpg(content: string, imagePath: string): Promise<string> {
    const jpgAbsPath = imagePath.replace(/\.[^/.]+$/, ".jpg");
    const jpgPublicPath = relativePathFromPublic(jpgAbsPath);
    if(fs.existsSync(jpgAbsPath)) {
        console.log(`JPG image already exists at ${jpgAbsPath}`);
        return await uploadImageToVercel(fs.readFileSync(jpgAbsPath), jpgPublicPath);
    }
    let url = await vercelImageExists(jpgPublicPath);
    if(url) {
        return url;
    }
    const pngBuffer = await generateFeaturedImagePngBuffer(content);
    const jpgBuffer = await convertPngBufferToJpgBuffer(pngBuffer);
    return await uploadImageToVercel(jpgBuffer, jpgPublicPath);
}
