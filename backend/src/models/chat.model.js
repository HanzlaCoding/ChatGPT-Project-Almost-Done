import mongoose, { model, Schema } from "mongoose";

const chatSchema = new Schema(
    {
        // 1. Linking to the User (Foreign Key)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },

        // 2. Chat Title
        title: {
            type: String,
            required: [true, "Chat title is required"],
            trim: true,
            default: "New Chat", // Fallback title
        },
    },
    {
        timestamps: true,
    }
);

export const chatModel = model("chats", chatSchema);