/**
 * @jest-environment node
 */
/**
 * This test file is for functions that don't require database access.
 * It can be used to run scripts to generate markdown files, images, etc.
 */
import {wishingWellGenerator} from "@/scripts/wishingWellGenerator";

beforeAll(async () => {
    //await checkDatabaseName();
});

describe("Test Functions that don't require database", () => {
    it("generates markdown and images for default wishing wells", async () => {
        const results = await wishingWellGenerator();
        expect(results).toHaveLength(10);
    });
});