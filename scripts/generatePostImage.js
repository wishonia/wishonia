const { OpenAI } = require("openai");
const fetch = require("node-fetch");
const fs = require("fs-extra");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateImage(body, model = "dall-e-3") {

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
async function generateAndSaveImage(content, imagePath) {
    const imagePrompt = `Generate a cover image for the following article. Do not include any text in the image. Use a colorful 16-bit style. Here's the article: ${content}`;
    const response = await generateImage({
        prompt: imagePrompt,
        resolution: "1792x1024",
        amount: 1
    });
    const imageUrl = response.url;
    const image = await fetch(imageUrl);
    const buffer = await image.buffer();
    await fs.writeFile(imagePath, buffer);
    return imagePath;
}

function convertToRelativePath(absolutePath) {
    // Split the coverImage path into an array of directories
    let pathArray = absolutePath.split(/\/|\\/);
    // Find the index of the 'public' directory
    let publicIndex = pathArray.indexOf('public');
    // If 'public' directory is not found, return the original path
    if (publicIndex === -1) {return absolutePath;}
    // Get the path after the 'public' directory
    return '/' + pathArray.slice(publicIndex + 1).join('/');
}

module.exports = {
    generateImage,
    generateAndSaveImage,
    convertToRelativePath
};