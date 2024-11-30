import OpenAI from "openai"
import { convertToLocalDateTime } from "@/lib/dateTimeWithTimezone"

// Create an OpenAI API client (that's edge-friendly!)
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

const defaultModel = process.env.OPENAI_MODEL || "gpt-4"
export async function textCompletion(
  promptText: string,
  returnType: "text" | "json_object"
): Promise<string> {
  // Ask OpenAI for a chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: defaultModel,
    stream: false,
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant`,
      },
      {
        role: "user",
        content: promptText,
      },
    ],
    ...(returnType === "json_object" && { response_format: { type: "json_object" } })
  })

  if (!response.choices[0].message.content) {
    throw new Error("No content in response")
  }

  const str = response.choices[0].message.content
  return replaceStupidWords(str)
}

export async function jsonArrayCompletion(promptText: string): Promise<any[]> {
  const response = await textCompletion(
    `Return a json array containing ${promptText}`,
    "json_object"
  )
  const arr = JSON.parse(response)
  if (!Array.isArray(arr)) {
    for (const key in arr) {
      if (Object.prototype.hasOwnProperty.call(arr, key)) {
        const element = arr[key]
        if (Array.isArray(element)) {
          return element
        }
      }
    }
  }
  return arr
}

export function formatTextResponse(text: string): string {
  // Remove quote marks
  text = text.replace(/"/g, "")
  text = replaceStupidWords(text)
  return text
}

function replaceStupidWords(text: string): string {
  text = text.replace("delves into", "explores")
  return text
}

export async function askYesOrNoQuestion(question: string): Promise<boolean> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: "Accurately answer the following question with a 'YES' or 'NO'."
      },
      {
        role: "user",
        content: question
      }
    ]
  })

  const answer = response.choices[0].message.content?.trim().toUpperCase() ?? ""
  
  if (answer === "YES" || answer === "NO") {
    return answer === "YES"
  }
  throw new Error(`Invalid response: ${answer} from question: ${question}`)
}

export async function getDateTimeFromStatementInUserTimezone(
  statement: string,
  utcDateTime: string,
  timeZoneOffset: number
): Promise<string> {
  const localDateTime = convertToLocalDateTime(utcDateTime, timeZoneOffset)
  const promptText = `
        estimate the date and time of the user statement based on the user's current date and time ${localDateTime}
         and the following user statement:
\`\`\`
${statement}
\`\`\`
       Return a single string in the format "YYYY-MM-DDThh:mm:ss"`
  let result = await textCompletion(promptText, "text")
  // Remove quote marks
  result = result.replace(/['"]+/g, "")
  return result
}
