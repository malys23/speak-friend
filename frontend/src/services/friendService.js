import api from './api';
import socket from '../utils/socket';

//Friend API calls
export const getFriends = async () => {
    const response = await api.get('/api/friends');
    return response.data;
};

export const getPendingRequests = async () => {
    const response = await api.get('/api/friends/pending');
    return response.data;
};

export const sendFriendRequest = async (email) => {
    const response = await api.post('/api/friends/request', {email});
    return response.data;
};

export const acceptFriendRequest = async (friendId) => {
    const response = await api.patch(`/api/friends/accept/${friendId}`);
    return response.data;
};

export const declineFriendRequest = async (friendId) => {
    const response = await api.delete(`/api/friends/decline/${friendId}`);
    return response.data;
};

//Friend socket services
export const subscribeFriendRequest = (callback) => {
    socket.on('friend_request', callback);
};

export const subscribeFriendRequestAccepted = (callback) => {
    socket.on('friend_request_accepted', callback);
};

export const subscribePendingRequests = (callback) => {
    socket.on('pending_requests', callback)
};

export const unsubscribeFriendRequest = () => {
    socket.off('friend_request');
};

export const unsubscribeFriendRequestAccepted = () => {
    socket.off('friend_request_accepted');
};

export const unsubscribePendingRequests = () => {
    socket.off('pending_requests');
};

export const requestPendingRequests = () => {
    socket.emit('get_pending_requests');
};
