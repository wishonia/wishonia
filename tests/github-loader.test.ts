/**
 * @jest-environment node
 */
import {GithubRepoLoader} from "langchain/document_loaders/web/github";
describe("githubLoader", () => {
    it("should load and process GitHub repository", async () => {
        const loader = new GithubRepoLoader(
            "https://github.com/langchain-ai/langchainjs",
            {
                branch: "main",
                recursive: false,
                unknown: "warn",
                maxConcurrency: 5, // Defaults to 2
                ignoreFiles: [
                    ".yarnrc",
                    ".env",
                    ".env.local",
                    ".eslintignore",
                    ]
            }
        );
        const docs = await loader.load();
        console.log({ docs });

    });
});
