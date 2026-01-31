import app from "./src/app.js";
import dotenv from 'dotenv';
import connectDb from "./src/db/db.js";
import { initializeSocketIO } from "./src/sockets/socket.server.js";
import http from 'http'
dotenv.config()
// Database Connected
connectDb()

// Socket.io Connection
const server = http.createServer(app);
initializeSocketIO(server);

server.listen(process.env.PORT, () => {

});