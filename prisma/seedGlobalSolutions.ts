import {User} from "@prisma/client";
import {loadJsonToDatabase} from "@/lib/prisma/dumpDatabaseToJson";

export async function seedGlobalSolutions(testUser: User) {
    await loadJsonToDatabase("GlobalSolution");
}