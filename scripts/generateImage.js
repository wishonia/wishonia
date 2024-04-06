const { OpenAI } = require("openai");

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

module.exports = {
    generateImage,
};