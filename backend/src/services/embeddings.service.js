import { GoogleGenerativeAI } from "@google/generative-ai"; 
// Note: "@google/genai" experimental hai, "@google/generative-ai" stable hai.

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Model Sahi Select Karein
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function getEmbedding(text) {
    try {
        // 3. Embedding Generate Karein
        const result = await model.embedContent(text);

        const vector = result.embedding.values;
        
        console.log(`Vector Length: ${vector.length}`); // Debug: Yeh 768 hona chahiye
        return vector;

    } catch (error) {
        console.error("Embedding Error:", error);
        throw error; // Error aage pass karein taaki pata chale
    }
}

export { getEmbedding };