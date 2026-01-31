import { Router } from "express";
import chatControllers from "../controllers/chat.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", authMiddleware, chatControllers.createChat);
router.get("/getChats", authMiddleware, chatControllers.getChats);
router.get("/getMessages", authMiddleware, chatControllers.getMessages);

export default router;