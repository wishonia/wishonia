import {Document} from "@langchain/core/documents";
import {OpenAIEmbeddings} from "@langchain/openai";
import {WishoniaLibArgs, WishoniaVectorStore} from "@/lib/utils/vectorStore";
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import {DirectoryLoader} from "langchain/dist/document_loaders/fs/directory";
import {TextLoader} from "langchain/dist/document_loaders/fs/text";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";

async function readMarkdownFile(filePath: string): Promise<Document> {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return new Document({
        pageContent: content,
        metadata: {
            ...data,
            source: filePath,
            filename: path.basename(filePath),
        },
    });
}

async function readMarkdownFilesFromDirectory(directoryPath: string): Promise<Document[]> {
    const files = await fs.readdir(directoryPath);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    return await Promise.all(
        markdownFiles.map(file => readMarkdownFile(path.join(directoryPath, file)))
    );
}

export async function embedMarkdownFiles(
    directoryPath: string,
    embeddings: OpenAIEmbeddings,
    vectorStoreConfig: WishoniaLibArgs
) {
    // Read and parse all markdown files in the directory
    const documents = await readMarkdownFilesFromDirectory(directoryPath);

    // Create a new WishoniaVectorStore instance
    const vectorStore = await WishoniaVectorStore.fromDocuments(
        documents,
        embeddings,
        vectorStoreConfig
    );

    console.log(`Embedded ${documents.length} markdown files from ${directoryPath}`);
    return vectorStore;
}

export async function loadMarkdownDocuments(absPath: string) {
// Load markdown files from directory
    const loader = new DirectoryLoader(absPath, {
        ".md": (path) => new TextLoader(path),
    });
    const documents = await loader.load();

// Create a new RecursiveCharacterTextSplitter
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
        separators: ["\n\n", "\n", " ", "#"],
    });

    return  await splitter.splitDocuments(documents);
}