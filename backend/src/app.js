// Packages
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // 1. Import this

// 2. Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "https://chatgpt-project-almost-done.onrender.com",
    credentials: true
}));

// Now __dirname will work here
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use('/api/auth', userRoutes);
app.use('/api/chat', chatRoutes);

// Wildcard route
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

export default app;