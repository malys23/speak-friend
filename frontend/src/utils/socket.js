import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

export const connectSocket = () => 
    new Promise((resolve, reject) => {
        if(socket.connected){
            resolve(socket);
            return;
        }

        socket.auth = { token: localStorage.getItem('token') };

        function cleanup() {
            socket.off('connect', onConnect);
            socket.off('conect_error', onError);
        }
        function onConnect(){
            cleanup();
            resolve(socket);
        }
        function onError(err){
            cleanup();
            reject(err);
        }

        socket.once('connect', onConnect);
        socket.once('connect_error', onError);
        socket.connect();
    });    

export const disconnectSocket = () => {
    socket.disconnect();
};

if(import.meta.env.DEV){
    socket.on('connect', () => console.log('Socket connected:', socket.id));
    socket.on('disconnect', (reason) => console.log('Socket disconnecte:', reason));
    socket.on('connect_error', (err) => console.log('Socket connection error:', err.message))
}

export default socket;