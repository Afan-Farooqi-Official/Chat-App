import express from 'express';
import cors from 'cors';
import http from 'http';
import 'dotenv/config';
import connectDB from './db/mongodb.js';
import connectCloudinary from './lib/cloudinary.js'
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import {Server} from 'socket.io'

// App config and HTTP server creation
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

// Store online users
export const userSocketMap = {};    // {userId: socketId}

// Socket.io connection handler
io.on("connection", (socket)=> {
    const userId = socket.handshake.query.userId
    
    if (userId) {
        userSocketMap[userId] = socket.id
    }

    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })

})

// middlewares
app.use(express.json({limit: '4mb'}));
app.use(cors());
connectDB();
connectCloudinary();

// api endpoints
app.get('/', (req, res) => {
    res.send('Server is up and running');
});
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

// start the express server
server.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));