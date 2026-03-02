import express from 'express';
import { 
    getFriends, 
    getPendingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest
} from '../controllers/friend.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getFriends);
router.get('/pending', authMiddleware, getPendingRequests);
router.post('/request', authMiddleware, sendFriendRequest);
router.post('/accept/:friendId', authMiddleware, acceptFriendRequest);
router.post('/decline/:friendId', authMiddleware, declineFriendRequest);

export default router;