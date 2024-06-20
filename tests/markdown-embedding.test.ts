/**
 * @jest-environment node
 */
import { prisma } from '@/lib/db';
import {getOrCreateTestUser} from "@/tests/test-helpers";
import {generateMarkdownEmbeddings} from "@/lib/loaders/github-markdown";
import {absPathFromPublic} from "@/lib/fileHelper";

describe('Markdown Embedding', () => {
    it('should create markdown embeddings of the docs', async () => {
        const user  = await getOrCreateTestUser();
        let dataSource = await prisma.datasource.findFirst({
            where: {
                name: 'Wishonia Docs'
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
        await generateMarkdownEmbeddings(absPathFromPublic('docs'), dataSource);
    });
});