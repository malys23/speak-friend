import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { notFound, errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import friendRoutes from './routes/friend.routes.js';

const app = express();

//MiddleWare
app.use(helmet());
app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    req.io = req.app.get('io');
    next();
});

//Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);

//Error Handler
app.use(notFound);
app.use(errorHandler);

export default app;