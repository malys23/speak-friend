import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { verifyToken } from './utils/jwt.js';
import { handleFriendEvents } from './sockets/friend.socket.js';

//Database
import './config/db.js';

//Initialize
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
    }
});

app.set('io', io);

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

//Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});