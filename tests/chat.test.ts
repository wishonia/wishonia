/**
 * @jest-environment node
 */
import { saveChat } from "@/lib/chat"
import { prisma } from "@/lib/db"
import { Chat } from "@/lib/types"

async function deleteChatsAndMessages() {
  await prisma.chatMessage.deleteMany({
    where: { chatId: "1" },
  })
  await prisma.chat.deleteMany({
    where: { id: "1" },
  })
}

describe("saveChat", () => {
  it("should create a new chat and save messages if chat does not exist", async () => {
    await deleteChatsAndMessages()
    const savedChat: Chat = {
      id: "1",
      title: "New Chat",
      userId: "test-user",
      createdAt: new Date(),
      path: "/chats/1",
      messages: [{ id: "1", content: "Message 1", role: "user" }],
    }

    await saveChat(savedChat)
    const messages = await prisma.chatMessage.findMany({
      where: { chatId: "1" },
    })
    expect(messages).toEqual([
      expect.objectContaining({ id: "1", content: "Message 1", role: "user" }),
    ])

    savedChat.messages.push({
      id: "2",
      content: "Message 2",
      role: "assistant",
    })
    await saveChat(savedChat)

    const createdChat = await prisma.chat.findUnique({
      where: { id: "1" },
      include: { messages: true },
    })

    expect(createdChat).toEqual({
      id: "1",
      title: "New Chat",
      userId: "test-user",
      createdAt: expect.any(Date),
      path: "/chats/1",
      messages: [
        expect.objectContaining({
          id: "1",
          content: "Message 1",
          role: "user",
        }),
        expect.objectContaining({
          id: "2",
          content: "Message 2",
          role: "assistant",
        }),
      ],
    })
  })

  it("should update an existing chat and save new messages", async () => {
    await deleteChatsAndMessages()
    await prisma.chat.create({
      data: {
        id: "1",
        title: "Existing Chat",
        userId: "test-user",
        createdAt: new Date(),
        path: "/chats/1",
        messages: {
          create: [
            { id: "1", content: "Message 1", role: "user" },
            { id: "2", content: "Message 2", role: "assistant" },
          ],
        },
      },
    })

    const savedChat: Chat = {
      id: "1",
      title: "Existing Chat",
      userId: "test-user",
      createdAt: new Date(),
      path: "/chats/1",
      messages: [
        { id: "1", content: "Message 1", role: "user" },
        { id: "2", content: "Message 2", role: "assistant" },
        { id: "3", content: "Message 3", role: "user" },
      ],
    }

    await saveChat(savedChat)

    const updatedChat = await prisma.chat.findUnique({
      where: { id: "1" },
      include: { messages: true },
    })

    expect(updatedChat).toEqual({
      id: "1",
      title: "Existing Chat",
      userId: "test-user",
      createdAt: expect.any(Date),
      path: "/chats/1",
      messages: [
        expect.objectContaining({
          id: "1",
          content: "Message 1",
          role: "user",
        }),
        expect.objectContaining({
          id: "2",
          content: "Message 2",
          role: "assistant",
        }),
        expect.objectContaining({
          id: "3",
          content: "Message 3",
          role: "user",
        }),
      ],
    })
  })

  // Add more test cases to cover different scenarios and edge cases
})
