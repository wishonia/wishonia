/**
 * @jest-environment node
 */
import {readAllMarkdownFiles} from "@/lib/markdownReader";
import {generateMetadataWhereMissing} from "@/lib/metadataGenerator";
import {generateWishingWellMarkdown} from "@/lib/wishingWellMarkdownGenerator";
import {generateGlobalProblems} from "@/lib/globalProblemGenerator";

beforeAll(async () => {
    //await checkDatabaseName();
});

describe("Test Markdown Reader", () => {
    it("generates missing metadata", async () => {
        const posts = await generateMetadataWhereMissing();
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
});