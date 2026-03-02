import {
    findFriendsByUserId,
    findPendingRequests,
    findUserByEmailForFriend,
    findExistingFriend,
    createFriendRequest,
    approveFriendRequest,
    deleteFriendRequest
} from '../models/friend.model.js';

export const getFriends = async(req, res) => {
    try{
        const friends = await findFriendsByUserId(req.user.user_id);
        res.status(200).json(friends);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Error fetching friends'});
    }
};

export const getPendingRequests = async(req, res) => {
    try{
        console.log('getPendingRequests called');
        console.log('user:', req.user);

        const requests = await findPendingRequests(req.user.user_id);
        console.log('requests: ', requests);
        
        res.status(200).json(requests);
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error fetching requests'});
    }
};

export const sendFriendRequest = async(req, res) => {
    try{
        const { email } = req.body;
        const senderId = req.user.user_id;

        const receiver = await findUserByEmailForFriend(email, senderId);
        if(!receiver){
            return res.status(404).json({ message: 'User not found' });
        }

        const existing = await findExistingFriend(senderId, receiver.user_id);
        if(existing){
            if(existing.status === 'accepted'){
                return res.status(400).json({ message: 'Aready friends' });
            }
            if(existing.status === 'pending'){
                return res.status(400).json({ message: 'Friend request already sent '});
            }
        }

        const request = await createFriendRequest(senderId, receiver.user_id);

        ////NOTIFY RECEIVER VIA SOCKET.IO
        req.io.to(`user_${receiver.user_id}`).emit('friend_request', {
            friend_id: request.friend_id,
            sender: {
                user_id: senderId,
                username: req.user.username
            }
        });

        res.status(201).json({message: 'Friend request sent' });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Error sending friend request '});
    }
};

export const acceptFriendRequest = async(req, res) => {
    try{
        const { friendId } = req.params;
        const friend = await approveFriendRequest(friendId);

        //NOTIFY SENDER VIA SOCKET.IO
        req.io.to(`user_${friend.user_id_1}`).emit('friend_request_accepted', {
            friend_id: friend.friend_id,
            acceptedBy: req.user.username
        });

        res.status(200).json({message: 'Friend request accepted'});

    }catch(err){
            console.log(err);
            res.status(500).json({ message: 'Error accepting friend request' });
    }
};

export const declineFriendRequest = async(req, res) => {
    try{
        const { friendId } = req.params;
        await deleteFriendRequest(friendId);
        res.status(200).json({message: 'Friend request declined '});
        
    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Error declining friend request' });
    }
};