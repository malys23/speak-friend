import pool from '../config/db.js';

const getRoomName = (userId1, userId2) => {
    return `chat_${Math.min(userId1, userId2)}_${Math.max(userId1, userId2)}`;
}

export function handlePrivateMessage(io, socket){

    socket.on('join_private_chat', ({ friendId }) => {
        const userId = socket.user.user_id;
        const roomName = getRoomName(userId, friendId);

        socket.join(roomName);
        console.log(`User ${userId} joined room ${roomName}`);
    });

    socket.on('send_private_message', async ({receiverId, content}) => {
        const senderId = socket.user.user_id;
        const roomName = getRoomName(senderId, receiverId);

        try{
            const result = await pool.query(
                `INSERT INTO private_messages (sender_id, receiver_id, content)
                 VALUES ($1, $2 , $3)
                 RETURNING *`,
                 [senderId, receiverId, content]
            );

            const message = result.rows[0];

            const userResult = await pool.query(
                `SELECT username, avatar_url FROM users WHERE user_id = $1`,
                [senderId]
            );

            const fullMessage = {
                ...message,
                username: userResult.rows[0].username,
                avatar_url: userResult.rows[0].avatar_url
            };

            io.to(roomName).emit('receive_private_message', fullMessage);

        } catch(err){
            console.error('Error sending private message:', err);
            socket.emit('message_error', {message: 'Failed to send message'});
        }
    });
}