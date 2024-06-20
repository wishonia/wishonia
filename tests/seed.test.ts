/**
 * @jest-environment node
 */
import {loadJsonToDatabase} from "@/lib/prisma/loadDatabaseFromJson";
import {assertTestDB, getOrCreateTestUser} from "@/tests/test-helpers";
import {seedGlobalProblemPairAllocations} from "@/prisma/seedGlobalProblemPairAllocations";
import {seedGlobalProblemSolutionPairAllocations} from "@/prisma/seedGlobalProblemSolutionPairAllocations";
beforeAll(async () => {
    await assertTestDB();
});

describe("Database-seeder tests", () => {
    jest.setTimeout(6000000);
    it("Seeds from JSON dump", async () => {
        const testUser = await getOrCreateTestUser();
        await loadJsonToDatabase("User");
        await loadJsonToDatabase("GlobalSolution", testUser.id);
        await loadJsonToDatabase("GlobalProblem", testUser.id);
        await loadJsonToDatabase("GlobalProblemSolution", testUser.id);
        await seedGlobalProblemPairAllocations(testUser);
        await seedGlobalProblemSolutionPairAllocations(testUser);;
        await loadJsonToDatabase("WishingWell", testUser.id);
    });
});


