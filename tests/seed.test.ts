/**
 * @jest-environment node
 */
import {loadJsonToDatabase} from "@/lib/prisma/loadDatabaseFromJson";
import {assertTestDB} from "@/tests/test-helpers";
beforeAll(async () => {
    await assertTestDB();
});

describe("Database-seeder tests", () => {
    jest.setTimeout(6000000);
    it("Seeds from JSON dump", async () => {
        await loadJsonToDatabase("User");
        await loadJsonToDatabase("GlobalSolution");
        await loadJsonToDatabase("GlobalProblem");
        await loadJsonToDatabase("GlobalProblemSolution");
        await loadJsonToDatabase("WishingWell");
    });
});


