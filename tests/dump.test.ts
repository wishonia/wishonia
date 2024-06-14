/**
 * @jest-environment node
 */
import {dumpDatabaseToJson} from "@/lib/prisma/dumpDatabaseToJson";

describe("Database-seeder tests", () => {
    jest.setTimeout(6000000);
    it("Dumps the database to json files", async () => {
        await dumpDatabaseToJson();
    });
});
