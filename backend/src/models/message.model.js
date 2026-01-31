import mongoose, { Schema, model } from 'mongoose';

const messageSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "model"],
        required: true
    }
}, {
    timestamps: true
});

// Model name consistent rakhein
export const messageModel = model("messages", messageSchema);