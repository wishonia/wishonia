import type { Chat } from "@/lib/types";
import { prisma } from "@/lib/db";

async function createNewChat(chat: Chat) {
    const createdChat = await prisma.chat.create({
        data: {
            id: chat.id,
            title: chat.title,
            userId: chat.userId,
            createdAt: chat.createdAt,
            path: chat.path,
        },
    });

    await createChatMessages(chat.messages, createdChat.id);

    return createdChat;
}

async function getExistingMessageIds(chatId: string) {
    return (
        await prisma.chatMessage.findMany({
            where: {
                chatId,
            },
            select: {
                id: true,
            },
        })
    ).map((m) => m.id);
}

async function createChatMessages(messages: Chat["messages"], chatId: string) {
    for (const message of messages) {
        const chatMessage = JSON.parse(JSON.stringify(message));
        chatMessage.chatId = chatId;

        try {
            await prisma.chatMessage.create({
                data: chatMessage,
            });
        } catch (error) {
            console.error(`createChatMessages error: ${error}`);
        }
    }
}

export async function saveChat(chat: Chat) {
    const existingChat = await prisma.chat.findFirst({
        where: {
            id: chat.id,
            userId: chat.userId,
        },
    });

    if (!existingChat) {
        await createNewChat(chat);
    } else {
        const existingMessageIds = await getExistingMessageIds(existingChat.id);
        const newMessages = chat.messages.filter(
            (message) => !existingMessageIds.includes(message.id)
        );

        await createChatMessages(newMessages, existingChat.id);
    }
}