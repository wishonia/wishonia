import {Datasource} from ".prisma/client";
import {WishoniaVectorStore} from "@/lib/utils/vectorStore";
import {OpenAIEmbeddings} from "@langchain/openai";
import {readAllMarkdownFiles} from "@/lib/markdownReader";
import {getMetaFromMarkdownFile} from "@/lib/markdownGenerator";

export async function generateMarkdownEmbeddings(docsRootPath: string, dataSource: Datasource, shouldRefresh?: boolean) {
    const markdownFiles = await readAllMarkdownFiles(docsRootPath);
    console.log(`Discovered ${markdownFiles.length} markdownFiles`);
    for (const markdownFile of markdownFiles) {

        const meta = getMetaFromMarkdownFile(markdownFile);

        meta.datasourceId = dataSource.id;
        await WishoniaVectorStore.fromTexts([markdownFile.content], meta,
            new OpenAIEmbeddings(),
            {
                datasourceId: dataSource.id,
            });
    }

    console.log('Embedding generation complete');
}