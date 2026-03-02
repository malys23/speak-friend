import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

export const connectSocket = () => {
    const token = localStorage.getItem('token');
    console.log('Connecting socket with token:', token);
    socket.auth = {token};
    socket.connect();

    return new Promise((resolve) => {
        if(socket.connected){
            resolve();
            return;
        }
        socket.on('connect', ()=> {
            console.log('Socket connected: ', socket.id);
            resolve();
        });
    });
};

export const disconnectSocket = () => {
    socket.disconnect();
};

socket.on('connect', ()=>{
    console.log('Socket connected:', socket.id);
});

socket.on('disconnect', (reason)=>{
    console.log('Socket disconnecte:', reason);
});

socket.on('connect_error', (err) => {
    console.log('Socket connection error:', err.message);
});

export default socket;