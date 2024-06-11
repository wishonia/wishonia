/**
 * @jest-environment node
 */

import fs from "fs";
import {generateMarkdownAndImageFromDescription} from "@/lib/markdownGenerator";
import {askSupabase} from "@/lib/docs/docsAgent";
import {createAgent} from "@/lib/agents/createAgent";
import {getOrCreateTestUser} from "@/tests/test-helpers";
import {getDialoqbaseClient, getWishoniaDocsAgent} from "@/lib/dialoqbase";

// Generate a cross-platform absolute path to "../public/docs" relative to the current file
const docsPath = fs.realpathSync(`${__dirname}/../public/docs`);
// Generate a cross-platform absolute path to the functional-components.m documentation file
const overviewPath = `${docsPath}/functional-components.md`;

describe("Docs Generator", () => {
    it("gets wishonia docs agent", async () => {
        const agent = await getWishoniaDocsAgent();
        const dialoqbase = await getDialoqbaseClient();
        const response = await dialoqbase.bot.chat(agent.id, {
            message: "Hello tell me a joke",
            stream: false,
            history: []
        });
    });
    it("Creates an agent", async () => {
        const testUser = await getOrCreateTestUser();
        const agent = await createAgent(
            testUser.id,
            "Wishonia Docs Agent",
        );
        expect(agent).toBeDefined();
    });
    it("Parses the function components overview documentation file and creates individual page", async () => {
        // read the overview file
        const overview = fs.readFileSync(overviewPath, "utf8");
        // split into sections based on top-level numbered list
        const sections = overview.split(/\n\d+\.\s/);
        // remove the first element, which is the title
        sections.shift();
        // loop through each section
        for(const section of sections) {
            // split the section into lines
            const lines = section.split("\n");
            // get the title from the first line
            let title = lines.shift();
            if(!title) {
                throw new Error("Title not found in section: " + section);
            }
            // remove any leading or trailing whitespace or line separators
            title = title.trim();
            const slugifiedTitle = title.toLowerCase().replace(/ /g, "-");
            let contentInstructions =
                `Please create a detailed product requirements document in markdown for the following
                 functional component of a universal
                 wish fulfillment system called Wishocracy.  
                 Do not require a specific technology stack. 
                 Include any information about existing systems that may fulfill these requirements.
                 Here's the description of the component:
                 ${section}`
            const outputPath = `${docsPath}/functional-components/${slugifiedTitle}.md`;
            await generateMarkdownAndImageFromDescription(outputPath, title, section, contentInstructions);
        }
    });
    it("Asks supabase about wishonia", async () => {
        const stream = await askSupabase("What is Wishonia?");
        console.log(stream);
        expect(stream).toBeDefined();
    });
});