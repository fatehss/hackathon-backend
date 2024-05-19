import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { fileName } from "../middleware/record/handlePatientRecordFile";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";

import { MongoClient } from "mongodb";
import fs from "fs";
import { patientDetailsVector } from "../types/types";
import path from "path";

// def a function to convert the saved PDF (i.e., sent from the frontend) to a document
export const loadDocument = async () => {
    try {
        const dest = path.join(".", "tmp", "patientFiles");
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const pathFile = path.join(`${dest}`, `${fileName}`);

        let loader;
        // 1. def the loader
        if (fileName.endsWith(".txt")) {
            loader = new TextLoader(pathFile);
        } else if (fileName.endsWith(".pdf")) {
            loader = new PDFLoader(pathFile, {
                splitPages: false,
            });
        }

        // 2. load the document
        const doc = await (loader as TextLoader | PDFLoader).load();

        return doc;
    } catch (error) {
        console.log("Error in convertPDFToDocument: ", error);
    }
};

// def a function to split the document to text chunks
export const splitDocumentToTextChunks = async (
    doc: any,
    chunkSize: number,
    chunkOverlap: number,
    patientDetails: patientDetailsVector
) => {
    try {
        // 1. def the splitter
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: chunkSize,
            chunkOverlap: chunkOverlap,
        });

        // 2. split the document (i.e., chop it into smaller pieces)
        const textChunks = await splitter.splitDocuments(doc);

        textChunks.forEach((text, idx) => {
            textChunks[idx].metadata["patientId"] = patientDetails.patientId;
            textChunks[idx].metadata["patientName"] =
                patientDetails.patientName;
        });

        return textChunks;
    } catch (error) {
        console.log("Error in splitDocumentToCharacters: ", error);
    }
};

// housekeeping for vectorization
// MongoDB connection setup
const MONGODB_URL = process.env.MONGODB_CONNECTION_STRING as string;
const client = new MongoClient(MONGODB_URL);

// OpenAI embeddings setup
const embeddingEngine = new OpenAIEmbeddings();

// def a function to vectorize the text chunks
export const vectorizeTextChunks = async (
    textChunks: any,
    dbName: string,
    collectionName: string
) => {
    // 1. connect to the MongoDB
    const collection = client.db(dbName).collection(collectionName);

    // 2. create a vectorstore
    const vectorstore = await MongoDBAtlasVectorSearch.fromDocuments(
        textChunks,

        embeddingEngine,
        {
            collection: collection,
            indexName: "default",
            textKey: "text",
            embeddingKey: "embedding",
        }
    );

    const assignedIds = await vectorstore.addDocuments([
        {
            pageContent: "upsertable",
            metadata: {},
        },
    ]);

    const upsertedDocs = [{ pageContent: "overwritten", metadata: {} }];

    // 3. add the documents to the vectorstore (i.e., method in langchain JS for mongoDB)
    await vectorstore.addDocuments(upsertedDocs, { ids: assignedIds });

    // 4.1 construct the query to delete the overwritten text
    const queryDelete = { text: "overwritten" };

    // 4.2 delete the documents matching the query
    const responseDeleteVectorBook = await collection.deleteMany(queryDelete);

    if (!responseDeleteVectorBook) {
        console.log("Text overwritten is not found in thevectorshelf");
    }
};

// def a function to delete the physical file after vectorization
// Function to delete a file
export function deleteFile(filePath: string) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
        } else {
            console.log("File successfully deleted:", filePath);
        }
    });
}

export const vectorSearch = async (
    dbName: string,
    collectionName: string,
    patientId: string,
    questionPrompt: string
) => {
    try {
        // 1. def the collection that will be used for the vector search
        const collection = client.db(dbName).collection(collectionName);

        const vectorStore = new MongoDBAtlasVectorSearch(embeddingEngine, {
            collection: collection,
            indexName: "vector_index",
            textKey: "text",
            embeddingKey: "embedding",
        });

        // 2. filter the metadata before doing the vector search
        let retriever = vectorStore.asRetriever({
            filter: {
                preFilter: {
                    patientId: { $eq: patientId },
                },
            },
        });

        // 3. get the relevant documents (i.e., results from the vector search)
        const vectorSearchResults = await retriever.getRelevantDocuments(
            questionPrompt
        );

        // Extract pageContent from each result and join them together
        const contextContent = vectorSearchResults
            .map((result) => result.pageContent)
            .join("")
            .replace(/\n/g, " ")
            .replace(/\+/g, "");

        return contextContent;
    } catch (error) {
        console.log("Error in vectorSearch: ", error);
    }
};

import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { openai } from "./aiChatwithVectorSearchEngine";

export const aiChatwithVectorSearchEngine = async (
    dbName: string,
    collectionName: string,
    searchQuery: string,
    patientId: string
) => {
    try {
        // const searchQuery = req.body.query;
        // const patientId = req.body.patientId;
        // const patientId = "id1";

        const context = await vectorSearch(
            dbName,
            collectionName,
            patientId,
            searchQuery
        );

        const messages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content:
                    "You are a Nurse AI, be professional and get to the point concisely. Only use the given context for your response",
            },

            {
                role: "assistant",
                content: `Given context: "${context}."`,
            },

            {
                role: "user",
                content: searchQuery,
            },
        ];

        const response = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-4o",
        });

        return response.choices[0].message.content;

        // console.log("response: ", response.choices[0].message.content);

        // res.json({ message: response.choices[0].message.content });
    } catch (error) {
        console.log("Error in aiChatwithVectorSearchEngine: ", error);
        // if (!res.headersSent) {
        //     res.status(500).json({ message: "Internal server error" });
        // } else {
        //     res.end();
        // }
    }
};
