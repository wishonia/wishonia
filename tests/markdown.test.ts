/**
 * @jest-environment node
 */
import {readAllMarkdownFiles} from "@/lib/markdownReader";
import {generateMetadataWhereMissing} from "@/lib/metadataGenerator";
import {generateWishingWellMarkdown} from "@/lib/wishingWellMarkdownGenerator";
import {generateGlobalProblems} from "@/lib/globalProblemGenerator";
import {generateMarkdownPageList} from "@/lib/markdownPageListGenerator";

beforeAll(async () => {
    //await checkDatabaseName();
});

describe("Test Markdown Reader", () => {
    // Set timeout to 10 minutes
    jest.setTimeout(600000);
    it("metadata updater", async () => {
        const posts = await generateMetadataWhereMissing(
            '');
    });
    it("gets markdown posts", async () => {
        const results = await readAllMarkdownFiles();
        expect(results.length).toBeGreaterThan(60);
    });
    it("generates markdown and images for default wishing wells", async () => {
        const posts = await generateWishingWellMarkdown();
        expect(posts).toHaveLength(10);
    });

    it("generates markdown and images for default wishing wells", async () => {
        const posts = await generateGlobalProblems();
        expect(posts).toHaveLength(10);
    });
    it("generates markdown page list", async () => {
        const result = await generateMarkdownPageList();
        expect(result).toBeUndefined();
    });
});