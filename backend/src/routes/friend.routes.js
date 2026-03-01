import express from 'express';
import { 
    getFriends, 
    getPendingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest
} from '../controllers/friend.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, getFriends);
router.get('/', authMiddleware, getPendingRequests);
router.post('/', authMiddleware, sendFriendRequest);
router.post('/', authMiddleware, acceptFriendRequest);
router.post('/', authMiddleware, declineFriendRequest);

export default router;