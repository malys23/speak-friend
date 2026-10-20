import AppError from '../utils/AppError.js';
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
    const friends = await findFriendsByUserId(req.user.user_id);
    res.status(200).json(friends);
};

export const getPendingRequests = async(req, res) => {
    const requests = await findPendingRequests(req.user.user_id);
    res.status(200).json(requests);
};

export const sendFriendRequest = async(req, res) => {
    const { email } = req.body;
    const senderId = req.user.user_id;

    const receiver = await findUserByEmailForFriend(email);
    if(!receiver){
        throw new AppError(404, 'User not found');
    }
    if(receiver.user_id === senderId){
        throw new AppError(400, 'You cannot add yourself')
    }

    const existing = await findExistingFriend(senderId, receiver.user_id);
    if(existing){
        if(existing.status === 'accepted') throw new AppError(409, 'Already friends');
        if(existing.status === 'pending') throw new AppError(409, 'Friend request already sent');
        //if(existing.status === 'blocked') throw new AppError(409, 'Unable to send a request')
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
};

export const acceptFriendRequest = async(req, res) => {
    const { friendId } = req.params;
    const friend = await approveFriendRequest(friendId);
    if(!friend){
        throw new AppError(404, 'Friend request not found');
    }

    //NOTIFY SENDER VIA SOCKET.IO
    req.io.to(`user_${friend.user_id_1}`).emit('friend_request_accepted', {
        friend_id: friend.friend_id,
        acceptedBy: req.user.username
    });

    res.status(200).json({message: 'Friend request accepted'});
};

export const declineFriendRequest = async(req, res) => {
    const friendId = Number(req.params.friendId);
    const deleted = await deleteFriendRequest(friendId, req.user.user_id);

    if(!deleted){
        throw new AppError(404, 'Friend request not found');
    }
    res.status(200).json({ message: 'Friend request declined' });
};