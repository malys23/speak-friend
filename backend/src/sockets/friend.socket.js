import { findPendingRequests } from '../models/friend.model.js';

export const handleFriendEvents = (io, socket) => {
    const userId = socket.user.user_id;
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined personal room user_${userId}`);

    socket.on('get_pending_requests', async () => {
        try{
            const pending = await findPendingRequests(userId);
        }catch(err){
            console.log('Error fetching pending requests: ', err);
            socket.emit('error', {message: 'Failed to load pending requests' });
        }
    });

    socket.on('disconnect', () =>{
        console.log(`User ${userId} left personal room user_${userId}`);
    });
};