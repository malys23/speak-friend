import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import { handlePrivateMessage } from './sockets/message.socket.js';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/auth.routes.js';

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

//Routes
app.use('/api/auth', authRoutes);

//Sockets.io events

app.get('/api/test', (req, res)=>{
    res.json({message: 'Hello from the backend!'});
});

//Error Handler
app.use((err, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong.';
    res.status(status).json({ message: message });
});

//Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});