import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { generateAiResponse } from "../services/ai.service.js";
import cookie from "cookie";
import { userModel } from "../models/user.model.js";
import { messageModel } from "../models/message.model.js";
import { queryData, upsertData } from "../services/vector.service.js";
import { config } from "dotenv";
config()

const initializeSocketIO = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL
        }
    });

    // Middleware for user
    io.use(async (socket, next) => {
        try {
            let authToken = socket.handshake.auth?.token;
            const parsedCookies = cookie.parse(authToken);
            authToken = parsedCookies.token;
            console.log("Auth Token:", authToken, parsedCookies);

            if (!authToken && socket.handshake.headers.cookie) {
                const rawCookies = socket.handshake.headers.cookie;
                console.log("Raw Cookies:", rawCookies);
                authToken = cookie.parse(rawCookies).token;
                console.log("Parsed Cookies:", cookie.parse(rawCookies));
            }

            if (!authToken) {
                return next(new Error("Authentication error: Token missing"));
            }

            const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

            const foundUser = await userModel.findById(decoded._id).select("-password");

            if (!foundUser) {
                return next(new Error("Authentication error: User not found"));
            }

            console.log("Token verified for user:", foundUser.email);
            socket.user = foundUser;
            next(); // Success!

        } catch (error) {
            // Agar token expired/invalid hai to ye chalega
            console.log("Socket Auth Error:", error.message);
            return next(new Error("Authentication error: Invalid or Expired Token"));
        }
    });

    io.on("connection", (socket) => {

        console.log("User Connected:", socket.user.email);
        socket.on("ai-message", async (messagePayload) => {
            console.log(messagePayload);

            let user = socket.user;

            const matches = await queryData(messagePayload.content);

            // Matches mein se text nikalo aur ek string banao
            const LongTermMemory = matches.map(match => match.metadata.text).join(" ");
            const shortTermMemory = await messageModel.find({}).sort({ createdAt: -1 }).limit(5)

            console.log("Purani Yaadein:", LongTermMemory);
            console.log("Nayi Yaadein:", shortTermMemory);


            // Creating message model in DB
            const newUserMessage = await messageModel.create({
                user: user._id,
                chat: messagePayload.chatId,
                content: messagePayload.content,
                role: "user"
            })

            console.log(`Message Created: ${newUserMessage}`);
            console.log(`Upserted Data: ${messagePayload.content, user._id, messagePayload.chatId, newUserMessage._id}`);

            // User response & embeddings
            const userEmbeddingsAndVectors = await upsertData(messagePayload.content, user._id, messagePayload.chatId, newUserMessage._id, "user")


            // aiResponse & embeddings
            // 4. MAIN STEP: Gemini ko Context + Question dono bhejo
            // Prompt Engineering: Hum Gemini ko bolenge purani baat use karke jawab de
            const promptWithContext = `
        Context (Previous History): ${LongTermMemory, shortTermMemory || "No previous history."}
        
        User Question: ${messagePayload.content}
        `;

            const aiResponse = await generateAiResponse(promptWithContext);

            const newAiMessage = await messageModel.create({
                user: user._id,
                chat: messagePayload.chatId,
                content: aiResponse,
                role: "model"
            })

            // Ai Embeddings & Vectors
            const aiEmbeddingsAndVectors = await upsertData(aiResponse, user._id, messagePayload.chatId, newAiMessage._id, "model")

            socket.emit("message", aiResponse)

        })

        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export { initializeSocketIO };