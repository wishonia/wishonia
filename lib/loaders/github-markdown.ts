import { v4 as uuidv4 } from 'uuid';
import { MarkdownSource } from '@/lib/loaders/sources/markdown';
import { walk } from '@/lib/loaders/sources/util';
import { prisma } from '@/lib/db';
import { getOpenaiClient } from "@/lib/openaiClient";
import { Datasource } from "@prisma/client";
import { getPostgresClient } from "@/lib/db/postgresClient";
import {indexDocuments} from "@/lib/loaders/pgvector/PostgresDocumentLoader";

async function discoverEmbeddingSources(docsRootPath: string): Promise<MarkdownSource[]> {
    const ignoredFiles = ['pages/404.mdx'];
    return (await walk(docsRootPath))
        .filter(({ path }) => /\.mdx?$/.test(path))
        .filter(({ path }) => !ignoredFiles.includes(path))
        .map(entry => new MarkdownSource('markdown', entry.path));
}

async function updateParentPage(existingPage: any, parentPath: string) {
    const existingParentPage = existingPage?.parentDatasourcePage;

    if (existingParentPage?.path !== parentPath) {
        console.log(`[${existingPage.path}] Parent datasourcePage has changed. Updating to '${parentPath}'...`);
        const parentPage = await prisma.datasourcePage.findUnique({ where: { path: parentPath } });

        await prisma.datasourcePage.update({
            where: { id: existingPage.id },
            data: { parentPageId: parentPage?.id }
        });
    }
}

async function updateExistingPage(existingPage: any, embeddingSource: any, refreshVersion: string, refreshDate: Date) {
    const { type, source, meta } = embeddingSource;

    await prisma.datasourcePage.update({
        where: { id: existingPage.id },
        data: {
            type,
            source,
            meta,
            version: refreshVersion,
            lastRefresh: refreshDate
        }
    });
}

async function deleteOldSections(existingPage: any, shouldRefresh: boolean) {
    if (existingPage) {
        if (!shouldRefresh) {
            console.log(`[${existingPage.path}] Docs have changed, removing old datasourcePage sections and their embeddings`);
        } else {
            console.log(`[${existingPage.path}] Refresh flag set, removing old datasourcePage sections and their embeddings`);
        }

        await prisma.datasourcePageSection.deleteMany({
            where: { datasourcePageId: existingPage.id }
        });
    }
}

async function createOrUpdateDatasourcePage(embeddingSource: any,
                                            parentPath: string | undefined,
                                            refreshVersion: string,
                                            refreshDate: Date,
                                            dataSource: Datasource,
                                            checksum: string) {
    const { type, source, path, meta } = embeddingSource;

    if (!meta) { throw new Error('Page meta is required'); }

    let parentPage = null;
    if (parentPath) {
        parentPage = await prisma.datasourcePage.findUnique({
            where: { path: parentPath }
        });
    }

    return prisma.datasourcePage.upsert({
        where: {path},
        create: {
            checksum,
            path,
            type,
            source,
            meta,
            parentPageId: parentPage?.id,
            version: refreshVersion,
            lastRefresh: refreshDate,
            datasourceId: dataSource.id
        },
        update: {
            checksum,
            type,
            source,
            meta,
            parentPageId: parentPage?.id,
            version: refreshVersion,
            lastRefresh: refreshDate
        }
    });
}

async function generateAndStoreSections(datasourcePage: any, sections: any[]) {
    console.log(`[${datasourcePage.path}] Adding ${sections.length} datasourcePage sections (with embeddings)`);

    for (const { slug, heading, content } of sections) {
        const input = content.replace(/\n/g, ' ');
        if(input.length < 5) {
            throw new Error(`Content too short for '${datasourcePage.path}' datasourcePage section with heading '${heading}'`);
        }

        try {
            const openai = getOpenaiClient();
            const response = await openai.createEmbedding({
                model: 'text-embedding-ada-002',
                input: input.replaceAll('\n', ' ')
            });
            const embeddingResponse = await response.json();

            const [responseData] = embeddingResponse.data;

            if (!slug) { throw new Error('Page section slug is required'); }
            if (!heading) { throw new Error('Page section heading is required'); }


            const  totalTokens = responseData?.usage?.total_tokens || 0;
            await createDatasourcePageSection(datasourcePage.id, slug, heading, content, totalTokens, responseData.embedding);
        } catch (err) {
            console.error(`Failed to generate embeddings for '${datasourcePage.path}' datasourcePage section starting with '${input.slice(0, 40)}...'`);
            throw err;
        }
    }
}

async function createDatasourcePageSection(datasourcePageId: string, slug: string, heading: string, content: string, tokenCount: number, embedding: number[]) {
    const pool = getPostgresClient();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const insertText =
            'INSERT INTO DatasourcePageSection(datasourcePageId, slug, heading, content, tokenCount, embedding) VALUES($1, $2, $3, $4, $5, $6)';
        await client.query(insertText, [datasourcePageId, slug, heading, content, tokenCount, embedding]);
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

async function updatePageChecksum(datasourcePage: any, checksum: string) {
    await prisma.datasourcePage.update({
        where: { id: datasourcePage.id },
        data: { checksum }
    });
}

async function deleteRemovedPages(refreshVersion: string) {
    console.log(`Removing old datasourcePages and their sections`);

    await prisma.datasourcePage.deleteMany({
        where: {
            version: { not: refreshVersion }
        }
    });
}

export async function generateMarkdownEmbeddings(docsRootPath: string, dataSource: Datasource, shouldRefresh?: boolean) {
    const refreshVersion = uuidv4();
    const refreshDate = new Date();

    const embeddingSources = await discoverEmbeddingSources(docsRootPath);
    console.log(`Discovered ${embeddingSources.length} datasourcePages`);

    if (!shouldRefresh) {
        console.log('Checking which datasourcePages are new or have changed');
    } else {
        console.log('Refresh flag set, re-generating all datasourcePages');
    }

    for (const embeddingSource of embeddingSources) {
        const { path, parentPath } = embeddingSource;

        try {
            const { checksum, meta, sections } = await embeddingSource.load();

            const existingPage = await prisma.datasourcePage.findUnique({
                where: { path },
                include: { parentDatasourcePage: { select: { id: true, path: true } } }
            });

            if (!shouldRefresh && existingPage?.checksum === checksum) {
                if (parentPath) {
                    await updateParentPage(existingPage, parentPath);
                }
                await updateExistingPage(existingPage, embeddingSource, refreshVersion, refreshDate);
                continue;
            }

            await deleteOldSections(existingPage, shouldRefresh || false);

            const datasourcePage = await createOrUpdateDatasourcePage(
                embeddingSource, parentPath, refreshVersion, refreshDate, dataSource, checksum);

            await generateAndStoreSections(datasourcePage, sections);

            //await updatePageChecksum(datasourcePage, checksum);
        } catch (err) {
            console.error(`Page '${path}' or one/multiple of its datasourcePage sections failed to store properly. Page has been marked with null checksum to indicate that it needs to be re-generated.`);
            console.error(err);
        }
    }

    await deleteRemovedPages(refreshVersion);

    console.log('Embedding generation complete');
}