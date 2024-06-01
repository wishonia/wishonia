import { Octokit } from "octokit";
import OpenAI from "openai";
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const user = process.env.npm_config_user || "wishonia";
const repo = process.env.npm_config_repo || "wishonia";
// Function to split the text into chunks with a maximum number of tokens
const MAX_TOKENS = 4000;

// Initialize Octokit for GitHub API
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN }).rest;

async function fetchAndStoreOpenIssues(owner: string, repo: string) {
    let page = 1;
    const perPage = 100; // GitHub API max is 100
    let issuesToProcess: any[] = [];
    // get repo id
    const { data: repoData } = await octokit.repos.get({
        owner,
        repo,
    });

    const repoId = repoData.id;

    console.log(`Fetching open issues for ${owner}/${repo}...`)

    // Fetch all open issues from GitHub
    while (true) {
        const { data: issues } = await octokit.issues.listForRepo({
            owner,
            repo,
            state: 'open',
            per_page: perPage,
            page,
        });

        issuesToProcess = issuesToProcess.concat(issues);

        if (issues.length < perPage) {
            break; // No more issues to fetch
        }

        page++;
        await sleep(2000); // Wait 2 seconds to respect GitHub API rate limits
        console.log(`Fetched page ${page} of issues.`)
    }

    console.log(`Fetched ${issuesToProcess.length} issues in total.`)
    // Process and store issues
    for (const issue of issuesToProcess) {
        // Check if issue already exists in the database
        const { data, error } = await supabaseClient
            .from('github_issues')
            .select('id')
            .eq('issue_id', issue.id)
            .eq('issue_number', issue.number)
            .eq('repo_id', repoId)
            .single();

        // if issue is not in the database, create it
        if (error && error.code === 'PGRST116') {
            
            const issueId = issue.id;
            const issueNumber = issue.number;

            const isSaved = await createEmbeddingsAndSaveToDatabase(issue.title + " " + issue?.body, repoId, issueId, issueNumber)

            if (!isSaved) {
                console.error(`Error storing issue ${issue.number} in the database.`);
            } else {
                console.log(`Issue ${issue.number} stored successfully.`);
            }

            sleep(2000); // Wait 2 seconds to respect OpenAI API rate limits
        }

        // If the issue already exists, skip to the next one
        if (data) {
            console.log(`Issue ${issue.number} already exists in the database.`);
            continue;
        }

    }

    console.log('Sync process completed successfully.');
}



export const splitIntoChunks = (text: string): string[] => {
    // For simplicity, we'll assume that we can split by sentences.
    // A more sophisticated tokenizer would be required for production use.
    const sentences = text.split('. ');
    let chunks: string[] = [];
    let currentChunk = '';

    sentences.forEach(sentence => {
        // Append sentence to current chunk if it doesn't exceed MAX_TOKENS
        if ((currentChunk + sentence).length <= MAX_TOKENS) {
            currentChunk += sentence + '. ';
        } else {
            // Chunk is full, push it and start a new one
            chunks.push(currentChunk);
            currentChunk = sentence + '. ';
        }
    });

    // Push the last chunk if it's not empty
    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}

// TODO: Implement this function
// export const createEmbeddingsAndSaveToDatabase = async (inputText: string, repoId: number, issueId: number, issueNumber: number): Promise<boolean> => {
//     const chunks = splitIntoChunks(inputText);
//
//     for (let index = 0; index < chunks.length; index++) {
//         const chunk = chunks[index];
//
//         try {
//             // Generate embedding for the chunk
//             const embeddingResponse = await openai.embeddings.create({
//                 input: chunk,
//                 model: 'text-embedding-ada-002'
//             });
//             const embedding = embeddingResponse.data[0].embedding;
//
//             // Insert the chunk content and its embedding into the database
//             const data = await prisma.githubIssueDocuments.create({
//                 data: {
//                     content: chunk,
//                     embedding: embedding,
//                     metadata: {
//                         repo_id: repoId,
//                         issue_id: issueId,
//                         issue_number: issueNumber,
//                     },
//                     repo_id: repoId,
//                     issue_id: issueId,
//                     issue_number: issueNumber,
//                 }
//             });
//
//             console.log('Data inserted successfully:', data);
//         } catch (error) {
//             console.error('Error inserting data into Prisma:', error);
//             return false;
//         }
//     }
//
//     return true;
};