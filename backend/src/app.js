// Packages
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import path from 'path';

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

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', userRoutes);
app.use('/api/chat', chatRoutes);

// Wildcard route for handling 404 errors
app.use('*name', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});


export default app;