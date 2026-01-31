import { getEmbedding } from "./embeddings.service.js";
import { Pinecone } from '@pinecone-database/pinecone'
import dotenv from "dotenv";
dotenv.config()

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

// Index select karein
const index = pc.index(`${process.env.PINECONE_INDEX_NAME}`);

async function upsertData(text, userId, chatId, msgIid, role) {
    try {
        console.log(`Generating embedding for: ${text}...`);

        // 1. Text ka vector generate karein
        const vector = await getEmbedding(text);

        console.log(`Upserting to Pinecone...`, vector);

        await index.upsert([
            {
                id: msgIid,
                values: vector,
                metadata: {
                    text: text,
                    role: role,
                    chat_id: chatId,
                    user_id: userId,
                    createdAt: new Date().toISOString()
                },
            },
        ]);

        console.log("Upsert successful!");
        return { success: true, message: "Data saved successfully" };

    } catch (error) {
        console.error("Upsert Error:", error);
        throw error;
    }
}

/**
 * Search karne ka function (RAG ke liye)
 */
async function queryData(queryText) {
    try {
        // 1. Query ka vector banayein
        const vector = await getEmbedding(queryText);

        // 2. Pinecone mein search karein
        const queryResponse = await index.query({
            vector: vector,
            topK: 3, // Top 3 milte-julte results layega
            includeMetadata: true, // Zaroori hai: Isse text wapas milega
        });

        return queryResponse.matches;
    } catch (error) {
        console.error("Query Error:", error);
        throw error;
    }
}

export { upsertData, queryData };