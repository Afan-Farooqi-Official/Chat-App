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

// Read allowed origins from .env
const allowedOrigins = process.env.NODE_ENV !== "production"
    ? [process.env.ALLOWED_ORIGINS1]
    : [process.env.ALLOWED_ORIGINS2]

// Initialize socket.io server
export const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if(!origin) return callback(null, true);
            if(allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error("CORS blocked"));
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
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

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

connectDB();
connectCloudinary();

// api endpoints
app.get('/', (req, res) => {
    res.send('Server is up and running');
});
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

// start the express server
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
}

// export server for vercel
export default server