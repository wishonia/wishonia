/**
 * @jest-environment node
 */
import {PrismaClient} from "@prisma/client";
import {getOrCreateTestUser} from "@/tests/test-helpers";
import {seedGlobalProblemPairAllocations} from "@/prisma/seedGlobalProblemPairAllocations";
let prisma = new PrismaClient();

describe("Global Problem Solutions", () => {
    jest.setTimeout(6000000);
    it("Generates Global Problem Pair Allocations", async () => {
        await seedGlobalProblemPairAllocations(await getOrCreateTestUser());
    });
});