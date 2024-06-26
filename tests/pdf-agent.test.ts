/**
 * @jest-environment node
 */
import {PDFLoader} from "@/lib/loaders/pdf";
import {getOrCreateDataSource} from "@/lib/datasource";
import {DatasourceType} from "@prisma/client";
import {getOrCreateTestUser} from "@/tests/test-helpers";

describe("PDF Agent", () => {
    it("Extracts structured data from PDF", async () => {
        const location = "https://bitcoin.org/bitcoin.pdf";
        const loader = new PDFLoader(location);
        const user =
            await getOrCreateTestUser();
        const dataSource =
            await getOrCreateDataSource(location,
                DatasourceType.PDF, location, user.id);
        const result = await loader.processSource(dataSource)
        expect(result).toBeDefined();
    });
});