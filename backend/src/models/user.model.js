import pool from '../config/db.js'

// function createUser (username, email, passwordHash, dob);
export const createUser = async(username, email, dob, passwordHash) => {
    const result = await pool.query(
        `INSERT INTO users (username, email, dob, password_hash)
         VALUES ($1, $2, $3, $4) RETURNING *`,
         [username, email, dob, passwordHash]
    );
    return result.rows[0];
}

// findUserByEmail(email);
export const findUserByEmail = async(email) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0];
}

//updateLastLogin(userId);
export const updateLastLogin = async (userId) => {
    const result = await pool.query(
        `UPDATE users SET last_login = CURRENT_TIMESTAMP
         WHERE user_id = $1`,
         [userId]
    );
}

// function findUserById (userId);
export const findUserById = async (userId) => {
    const result = await pool.query(
        `SELECT user_id, username, email, dob, created_at, last_login, is_active, avatar_url
         FROM users WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0];
}

// findUserByUsername(username);
export const findUserByUsername = async (username) => {
    const result = await pool.query(
        `SELECT user_id, username, email, dob, created_at, last_login, is_active, avatar_url
         FROM users WHERE username = $1`,
        [username]
    );
    return result.rows[0];
}

// updateUser(userId, fields);
/////INQURIEEEEE!!!!!
// export const updateUser = async (userId, fields) => {
//     const keys = Object.keys(fields);
//     const values = Object.values(fields);
//     const setClause = keys.map((key, i) => `${key} = $${i+2}`).join(', ');

//     const result = await pool.query(
//         `UPDATE users SET ${setClause}
//          WHERE user_id = $1 RETURNING *`,
//         [userId, ...values]
//     );

//     return result.rows[0];
// }

//deleteUser(userId);
export const deleteUser = async (userId) => {
    const result = await pool.query(
        `DELETE FROM users WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0];
}

// deactivateUser(userId);
export const deactivateUser = async (userId) => {
    const result = await pool.query(
        `UPDATE user SET is_active = FALSE
         WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0];
}

// updatePassword(userId, newPasssordHash);
export const updatePassword = async (userId, newPasswordHash) => {
    const result = await pool.query(
        `UPDATE users SET password_hash = $1
         WHERE user_id = $2`,
        [newPasswordHash, userId]
    );
}

// updateAvatar(userId, avatarURL);
export const updateAvatar = async(userId, avatarUrl) => {
    const result = await pool.query(
        `UPDATE users SET avatar_url = $1
         WHERE user_id = $2`,
        [avatarUrl, userId]
    );
    return result.rows[0];
}

// searchUsers(searchTerm);
// //INQUIREEEE!!!!
// export const searchUsers = async (searchTerm) =>{
//     const result = await pool.query(
//         `SELECT user_id, username, avatar_url FROM users
//          WHERE username ILIKE $1 AND is_active = TRUE`,
//          [`%${searchTerm}%`]
//     );
//     return result.rows;
// }

// findUsersByIds(userIds);
export const findUsersByIds = async (userIds) => {
    const result = await pool.query(
        `SELECT user_id, username, avatar_url
         FROM users WHERE user_id = ANY($1)`,
         [userIds]
    );
    return result.rows;
}