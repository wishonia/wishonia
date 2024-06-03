/**
 * @jest-environment node
 */
import queryRepo from "@/lib/github/repoAgent";
describe("Repo Agent", () => {
    it("queryRepo should index and respond to queries about the repo", async () => {
        const answer = await queryRepo(
                "Please provide a list of the steps required to optimize societal resource allocation.");
        console.log("Answer: ", answer);
        expect(answer).toContain(`self-improving GitHub repository`);
    });
});
