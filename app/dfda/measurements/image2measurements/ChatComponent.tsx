import { FunctionCallHandler, nanoid } from "ai"
import { Message, useChat } from "ai/react"
import React from "react"

interface ChatComponentProps {
  base64Image: string
}

const ChatComponent: React.FC<ChatComponentProps> = ({ base64Image }) => {
  console.log("Base64 image:", base64Image)
  const functionCallHandler: FunctionCallHandler = async (
    chatMessages,
    functionCall
  ) => {
    if (functionCall.name === "get_custom_description") {
      if (functionCall.arguments) {
        const parsedFunctionCallArguments: { prompt: string } = JSON.parse(
          functionCall.arguments
        )
        // Here you can handle the custom description logic
        // For example, you can send a request to your API to get the custom description
        // Then, you can add the custom description to the chat messages

        // Send a request to the GPT-4 Vision API with the base64 image and the new prompt
        const customDescriptionResponse = await fetch(
          "/api/image2measurements",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              file: base64Image,
              prompt: parsedFunctionCallArguments.prompt,
              max_tokens: 100, // replace 100 with the number of tokens you want
              // Include any other parameters you need
            }),
          }
        )

        const responseData = await customDescriptionResponse.json()
        const customDescription = responseData.analysis

        return {
          messages: [
            ...chatMessages,
            {
              id: nanoid(),
              name: "get_custom_description",
              role: "function" as const,
              content: customDescription,
            },
          ],
        }
      }
    }
  }

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat-with-functions",
    experimental_onFunctionCall: functionCallHandler,
  })

  const roleToColorMap: { [key: string]: string } = {
    system: "red",
    user: "black",
    function: "blue",
    assistant: "green",
    data: "purple", // Added color for 'data'
    tool: "orange", // Added color for 'tool'
  }

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.length > 0
        ? messages.map((m: Message) => (
            <div
              key={m.id}
              className="whitespace-pre-wrap"
              style={{ color: roleToColorMap[m.role] || "defaultColor" }} // Provide a default color if the role is not found
            >
              <strong>{`${m.role}: `}</strong>
              {m.content || JSON.stringify(m.function_call)}
              <br />
              <br />
            </div>
          ))
        : null}
      <div id="chart-goes-here" />
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          value={input}
          placeholder="Ask a question about your data..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  )
}

export default ChatComponent
