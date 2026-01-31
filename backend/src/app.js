// Packages
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors';

// Routes
import userRoutes from './routes/user.routes.js'
import chatRoutes from './routes/chat.routes.js'

const app = express()

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use('/api/auth', userRoutes);
app.use('/api/chat', chatRoutes);

export default app;