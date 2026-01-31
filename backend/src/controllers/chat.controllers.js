import { chatModel } from '../models/chat.model.js'
import { messageModel } from '../models/message.model.js'

const createChat = async (req, res) => {
    const chat = req.body;
    const user = req.user;

    if (!chat) {
        return res.status(400).json({
            message: "Please provide chat title!"
        })
    }

    const createdChat = await chatModel.create({
        user: user._id,
        title: chat.title
    })

    return res.status(200).json({
        message: "Chat created successfully",
        newChat: createdChat
    })

}

const getChats = async (req, res) => {
    const chats = await chatModel.find({
        user: req.user._id
    });

    if (chats.length <= 0) {
        return res.status(400).json({
            message: "No chats found!"
        })
    }

    const filterChats = chats.map((items) => {
        let { _id, title, user } = items;
        return { _id, title, user }
    })

    return res.status(200).json({
        message: "Chats fetched successfully!",
        chats: filterChats
    })
}

const getMessages = async (req, res) => {
    const { _id } = req.user;



    const messages = await messageModel.find({ user: _id });

    const filterMessages = messages.map((items) => {
        const { user, chat, content, role } = items;

        return { user, chat, content, role }
    })

    return res.status(200).json({
        message: "Messages fetched successfully!",
        messages: filterMessages
    })

}

export default { createChat, getChats, getMessages }