import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';

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

//Sockets.io events

app.get('/api/test', (req, res)=>{
    res.json({message: 'Hello from the backend!'});
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