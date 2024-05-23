/**
 * @jest-environment node
 */

import {readAllMarkdownFiles} from "@/lib/markdownReader";
import {generateMetadataWhereMissing} from "@/lib/metadataGenerator";

beforeAll(async () => {
    //await checkDatabaseName();
});

describe("Test Markdown Reader", () => {
    it("generates missing metadata", async () => {
        const posts = await generateMetadataWhereMissing();
    });
    it("gets markdown posts", async () => {
        const results = await readAllMarkdownFiles();
        expect(results).toHaveLength(10);
    });
});