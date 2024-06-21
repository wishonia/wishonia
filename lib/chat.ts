import type { Chat } from "@/lib/types";
import { prisma } from "@/lib/db";

async function createNewChat(chat: Chat) {
    try {
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
    } catch (error) {
        debugger
        console.error(`createNewChat error: ${error}. could not create chat with params: `, chat);
        throw error;
    }
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
            debugger
            console.error(`createChatMessages error: ${error} for chatMessage: `, chatMessage);
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