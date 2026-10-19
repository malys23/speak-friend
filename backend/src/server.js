import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import { verifyToken } from './utils/jwt.js';

import { handleFriendEvents } from './sockets/friend.socket.js';

import authRoutes from './routes/auth.routes.js';
import friendRoutes from './routes/friend.routes.js';

//Database
import './config/db.js';

//Initialize
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
    }
});

//MiddleWare
app.use(helmet());
app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    req.io = io;
    next();
});

//Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);

//Socket.io
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if(!token) return next(new Error('Unauthorized'));
    try{
        const decoded = verifyToken(token);
        socket.user = decoded;
        next();
    } catch(err) {
        console.log('Socket auth error:', err.message);
        next(new Error('Invalid token'));
    }
});

//Socket Events
io.on('connection', (socket) =>{
    handleFriendEvents(io, socket);
});

//Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});

//Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});