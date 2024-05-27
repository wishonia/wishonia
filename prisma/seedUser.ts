import { prisma } from "@/lib/db";

export async function seedUser() {
    return prisma.user.create({
        data: {
            email: "test@example.com",
            username: "test-user",
            firstName: "Test",
            lastName: "User",
            bio: "I am a test user",
            // Add other user fields as needed
        },
    });
}
