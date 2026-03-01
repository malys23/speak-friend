import pool from '../config/db.js'

//Get all accepted friends from user
export const findFriendsByUserId = async (userId) => {
    const result = await  pool.query(
        `SELECT
            f.friend_id,
            f.status,
            f.created_at,
            u.user_id,
            u.username,
            u.avatar_url,
            u.email
        FROM friends f
        JOIN users u on (
            CASE
                WHEN f.user_id_1 = $1 THEN f.user_id_2 = u.user_id
                ELSE f.user_id_1 = u.user_id
            END
        )
        WHERE (f.user_id_1 = $1 OR f.user_id_2 = $1)
        AND f.status= 'accepted'`,
        [userId]
    );
    return result.rows;
}

//Get pending friend requests recieved by a user
export const findPendingRequests = async (userId) => {
    const result = await  pool.query(
        `SELECT
            f.friend_id,
            f.status,
            f.created_at,
            u.user_id,
            u.username,
            u.avatar_url,
            u.email
        FROM friends f
        JOIN users u ON f.user_id_1 = u.user_id
        WHERE f.user_id_2 = $1
        AND f.status = 'pending`,
        [userId]
    );
    return result.rows;
}

//Find user by email for friend search
export const findUserByEmailForFriend = async (email, currentUserId) => {
    const result = await  pool.query(
        `SELECT user_id, username, email, avatar_url
        FROM users
        WHERE email = $1 AND user_id != $2`,
        [email, currentUserId]
    );
    return result.rows[0];
}

//Check if friendship already exists
export const findExistingFriend = async (userId1, userId2) => {
    const result = await  pool.query(
        `SELECT * FROM friends
        WHERE (user_id_1 = $1 AND user_id_2=$2)
        OR (user_id_1 = $2 AND user_id_2 = $1)`,
        [userId1, userId2]
    );
    return result.rows[0];
}

//Send friend request
export const createFriendRequest = async (senderId, receiverId) => {
    const result = await  pool.query(
        `INSERT INTO friends (user_id_1, user_id_2, status)
        VALUES ($1, $2, 'pending') RETURNING *`,
        [Math.min(senderId, receiverId), Math.max(senderId, receiverId)]
    );
    return result.rows[0];
}

//Accept friend request
export const acceptFriendRequest = async (friendId) => {
    const result = await  pool.query(
        `UPDATE friends SET status= 'accepted'
        WHERE friend_id = $1 RETURNING *`,
        [friendId]
    );
    return result.rows[0];
}

//Decline/delete friend request
export const deleteFriendRequest = async (friendId) => {
    const result = await  pool.query(
        `DELETE FROM friends WHERE friend_id=$1`,
        [friendId]
    );
    return result.rows[0];
}