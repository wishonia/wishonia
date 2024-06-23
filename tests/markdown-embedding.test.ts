/**
 * @jest-environment node
 */
import { prisma } from '@/lib/db';
import {getOrCreateTestUser} from "@/tests/test-helpers";
import {embedMarkdownFiles} from "@/lib/loaders/markdown-loader";
import {WishoniaLibArgs} from "@/lib/utils/vectorStore";
import {OpenAIEmbeddings} from "@langchain/openai";
import {absPathFromPublic} from "@/lib/fileHelper";

describe('Markdown Embedding', () => {
    it('should create markdown embeddings of the docs', async () => {
        const user  = await getOrCreateTestUser();
        let name = 'Wishonia Docs';
        const type = DataSourceTypes.MARKDOWN;
        let dataSource = await prisma.datasource.findFirst({
            where: {
                name: name
            }
        });
        if(!dataSource) {
            dataSource = await prisma.datasource.create({
                data: {
                    name: 'Wishonia Docs',
                    type: 'MARKDOWN',
                    url: 'https://github.com/wishonia/wishonia/blob/main/',
                    userId: user.id,
                }
            });
        }
        const embeddings =
            new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        const vectorStoreConfig: WishoniaLibArgs = {
            datasourceId: dataSource.id,
        };

        const markdownDirectory = absPathFromPublic('docs');

        try {
            const vectorStore = await embedMarkdownFiles(markdownDirectory, embeddings, vectorStoreConfig);
            console.log("Markdown files have been successfully embedded and stored.");

            // Example: Perform a similarity search
            const query = "Your search query here";
            const queryEmbedding = await embeddings.embedQuery(query);
            const searchResults = await vectorStore.similaritySearchVectorWithScore(queryEmbedding, 5);

            console.log("Search results:", searchResults);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    });
});