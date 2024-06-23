/**
 * @jest-environment node
 */
import {getOrCreateTestUser} from "@/tests/test-helpers";
import {generateMarkdownEmbeddings} from "@/lib/loaders/github-markdown";
import {absPathFromPublic} from "@/lib/fileHelper";
import {DatasourceType} from ".prisma/client";
import {getOrCreateDataSource} from "@/lib/datasource";

describe('Markdown Embedding', () => {
    it('should create markdown embeddings of the docs', async () => {
        const user  = await getOrCreateTestUser();
        let name = 'Wishonia Docs';
        const type = DatasourceType.MARKDOWN;
        let url = 'https://github.com/wishonia/wishonia/blob/main/';
        let userId = user.id;
        let dataSource = await getOrCreateDataSource(name, type, url, userId);
        await generateMarkdownEmbeddings(absPathFromPublic('docs'), dataSource);
    });
});