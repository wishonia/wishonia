import {inspect} from 'util'
import {v4 as uuidv4} from 'uuid'
import {MarkdownSource} from '@/lib/loaders/sources/markdown'
import {walk} from '@/lib/loaders/sources/util'
import {prisma} from '@/lib/db'
import {getOpenaiClient} from "@/lib/openaiClient";
import {Datasource} from "@prisma/client";
import {getPostgresClient} from "@/lib/db/postgresClient";

export async function generateMarkdownEmbeddings(
    docsRootPath: string,
    dataSource: Datasource,
    shouldRefresh?: boolean) {
    // Use this version to track which datasourcePages to purge
    // after the refresh
    const refreshVersion = uuidv4()
    const refreshDate = new Date()
    const ignoredFiles = ['pages/404.mdx']
    const embeddingSources = (await walk(docsRootPath))
        .filter(({path}) => /\.mdx?$/.test(path))
        .filter(({path}) => !ignoredFiles.includes(path))
        .map(entry => new MarkdownSource('markdown', entry.path))

    console.log(`Discovered ${embeddingSources.length} datasourcePages`)

    if (!shouldRefresh) {
        console.log('Checking which datasourcePages are new or have changed')
    } else {
        console.log('Refresh flag set, re-generating all datasourcePages')
    }

    for (const embeddingSource of embeddingSources) {
        const {type, source, path, parentPath} = embeddingSource

        try {
            const {checksum, meta, sections} = await embeddingSource.load()

            // Check for existing datasourcePage in DB and compare checksums
            const existingPage = await prisma.datasourcePage.findUnique({
                where: {path},
                include: {parentDatasourcePage: {select: {id: true, path: true}}}
            })

            // We use checksum to determine if this datasourcePage & its sections need to be regenerated
            if (!shouldRefresh && existingPage?.checksum === checksum) {
                const existingParentPage = existingPage?.parentDatasourcePage

                // If parent datasourcePage changed, update it
                if (existingParentPage?.path !== parentPath) {
                    console.log(
                        `[${path}] Parent datasourcePage has changed. Updating to '${parentPath}'...`
                    )
                    const parentPage = await prisma.datasourcePage.findUnique({where: {path: parentPath}})

                    await prisma.datasourcePage.update({
                        where: {id: existingPage.id},
                        data: {parentPageId: parentPage?.id}
                    })
                }

                // No content/embedding update required on this datasourcePage
                // Update other meta info
                await prisma.datasourcePage.update({
                    where: {id: existingPage.id},
                    data: {
                        type,
                        source,
                        meta,
                        version: refreshVersion,
                        lastRefresh: refreshDate
                    }
                })

                continue
            }

            if (existingPage) {
                if (!shouldRefresh) {
                    console.log(
                        `[${path}] Docs have changed, removing old datasourcePage sections and their embeddings`
                    )
                } else {
                    console.log(
                        `[${path}] Refresh flag set, removing old datasourcePage sections and their embeddings`
                    )
                }

                await prisma.datasourcePageSection.deleteMany({
                    where: {datasourcePageId: existingPage.id}
                })
            }

            const parentPage = await prisma.datasourcePage.findUnique({
                where: {path: parentPath}
            })
            if(!meta) {throw new Error('Page meta is required')}

            // Create/update datasourcePage record. Intentionally clear checksum until we
            // have successfully generated all datasourcePage sections.
            const datasourcePage = await prisma.datasourcePage.upsert({
                where: {path},
                create: {
                    checksum: null,
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
                    checksum: null,
                    type,
                    source,
                    meta,
                    parentPageId: parentPage?.id,
                    version: refreshVersion,
                    lastRefresh: refreshDate
                }
            })

            console.log(
                `[${path}] Adding ${sections.length} datasourcePage sections (with embeddings)`
            )
            for (const {slug, heading, content} of sections) {
                // OpenAI recommends replacing newlines with spaces for best results (specific to embeddings)
                const input = content.replace(/\n/g, ' ')

                try {
                    const openai = getOpenaiClient();
                    const response = await openai.createEmbedding({
                        model: 'text-embedding-ada-002',
                        input: input.replaceAll('\n', ' '),
                    });
                    const embeddingResponse = await response.json();

                    if (embeddingResponse.status !== 200) {
                        throw new Error(inspect(embeddingResponse.data, false, 2))
                    }

                    const [responseData] = embeddingResponse.data.data

                    if(!slug) {throw new Error('Page section slug is required')}
                    if(!heading) {throw new Error('Page section heading is required')}
                    const pool = getPostgresClient();
                    const createDatasourcePageSection = async (
                        datasourcePageId: string,
                        slug: string,
                        heading: string,
                        content: string,
                        tokenCount: any,
                        embedding: any) => {
                        const client = await pool.connect();
                        try {
                            await client.query('BEGIN');
                            const insertText =
                                'INSERT INTO DatasourcePageSection(datasourcePageId, slug, heading, content, tokenCount, embedding) VALUES($1, $2, $3, $4, $5, $6)';
                            const res = await client.query(insertText, [datasourcePageId, slug, heading, content, tokenCount, embedding]);
                            await client.query('COMMIT');
                        } catch (e) {
                            await client.query('ROLLBACK');
                            throw e;
                        } finally {
                            client.release();
                        }
                    }

                } catch (err) {
                    // TODO: decide how to better handle failed embeddings
                    console.error(
                        `Failed to generate embeddings for '${path}' datasourcePage section starting with '${input.slice(
                            0,
                            40
                        )}...'`
                    )

                    throw err
                }
            }

            // Set datasourcePage checksum so that we know this datasourcePage was stored successfully
            await prisma.datasourcePage.update({
                where: {id: datasourcePage.id},
                data: {checksum}
            })
        } catch (err) {
            console.error(
                `Page '${path}' or one/multiple of its datasourcePage sections failed to store properly. Page has been marked with null checksum to indicate that it needs to be re-generated.`
            )
            console.error(err)
        }
    }

    console.log(`Removing old datasourcePages and their sections`)

    // Delete datasourcePages that have been removed (and their sections via cascade)
    await prisma.datasourcePage.deleteMany({
        where: {
            version: { not: refreshVersion }
        }
    })

    console.log('Embedding generation complete')
}