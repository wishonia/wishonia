/**
 * API Route - Image Processing
 *
 * This API route is designed for processing images within an application using the OpenAI API.
 * It handles the reception of an image file (in base64 format) and an optional custom prompt through a POST request.
 * The route then sends this data to OpenAI for analysis, typically involving image description or any other
 * relevant vision-based task. The response from OpenAI, containing the analysis of the image, is then returned
 * to the user.
 *
 * Path: /api/image2measurements
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import {handleError} from "@/lib/errorHandler";

// Initialize the OpenAI client with the API key. This key is essential for authenticating
// the requests with OpenAI's API services.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  // Logging the start of the image processing API call
  console.log('Starting the image processing API call');

  // Extracting the file (in base64 format) and an optional custom prompt
  // from the request body. This is essential for processing the image using OpenAI's API.
  let { file: base64Image, prompt: customPrompt, detail, max_tokens, image } = await request.json();

  base64Image = base64Image || image;
  // Check if the image file is included in the request. If not, return an error response.
  if (!base64Image) {
    console.error('No file found in the request');
    return NextResponse.json({ success: false, message: 'No file found' });
  }

  // Log the receipt of the image in base64 format
  console.log('Received image in base64 format');

  // Use the provided custom prompt or a default prompt if it's not provided.
  // This prompt guides the analysis of the image by OpenAI's model.
  let promptText = `
  Analyze the provided image and estimate the macro and micronutrient content of any food items, and extract data about any medications or nutritional supplements present. Return the results as an array of structured JSON data with the following format:

[
  {
    "type": "food",
    "food_item": "string",
    "serving_size": "string",
    "calories": number,
    "macronutrients": {
      "protein": {
        "value": number,
        "unit": "string"
      },
      "carbohydrates": {
        "value": number,
        "unit": "string"
      },
      "fat": {
        "value": number,
        "unit": "string"
      }
    },
    "micronutrients": [
      {
        "name": "string",
        "value": number,
        "unit": "string"
      },
      ...
    ]
  },
  {
    "type": "medication",
    "name": "string",
    "dosage": "string",
    "frequency": "string",
    "purpose": "string"
  },
  {
    "type": "supplement",
    "name": "string",
    "brand": "string",
    "dosage": "string",
    "ingredients": [
      {
        "name": "string",
        "amount": "string"
      },
      ...
    ]
  },
  ...
]

For food items:
- The "type" field should be set to "food".
- The "food_item", "serving_size", "calories", "macronutrients", and "micronutrients" fields should be populated as described in the previous prompt.

For medications:
- The "type" field should be set to "medication".
- The "name" field should contain the name of the medication.
- The "dosage" field should specify the dosage information.
- The "frequency" field should indicate how often the medication should be taken.
- The "purpose" field should briefly describe the purpose or condition the medication is intended to treat.

For nutritional supplements:
- The "type" field should be set to "supplement".
- The "name" field should contain the name of the supplement.
- The "brand" field should specify the brand or manufacturer of the supplement, if available.
- The "dosage" field should indicate the recommended dosage.
- The "ingredients" array should contain objects representing the ingredients and their amounts in the supplement.

Please provide the JSON output without any additional text or explanations.
  `
  // Log the chosen prompt
  console.log(`Using prompt: ${promptText}`);

  // Sending the image and prompt to OpenAI for processing. This step is crucial for the image analysis.
  console.log('Sending request to OpenAI');
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: promptText },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
                ...(detail && { detail: detail }) // Include the detail field only if it exists
              }
            }
          ]
        }
      ],
      response_format: {
        type: "json_object"
      },
      max_tokens: max_tokens
    });

    // Log the response received from OpenAI, which includes the analysis of the image.
    console.log('Received response from OpenAI');
    //console.log('Response:', JSON.stringify(response, null, 2)); // Log the response for debugging

    // Extract and log the analysis from the response
    const analysis = response?.choices[0]?.message?.content;
    console.log('Analysis:', analysis);

    // Return the analysis in the response
    return NextResponse.json({ success: true, analysis: analysis });
  } catch (error) {
    return handleError(error, "image2measurements");
  }
}
