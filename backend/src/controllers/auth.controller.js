import AppError from '../utils/AppError.js';
import { generateToken} from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { findUserByEmail, createUser, updateLastLogin } from '../models/user.model.js';

export const register = async (req, res) => {
    const {username, email, dob, password} = req.body;

    const passwordHash = await hashPassword(password);

    const newUser = await createUser(username, email, dob || null, passwordHash);

    res.status(201).json({message: 'User created successfully'});

};

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    const user = await findUserByEmail(email);
    const passwordMatch = user && (await comparePassword(password, user.password_hash));

    if(!user || !passwordMatch){
        throw new AppError(401, 'Invalid email or password')
    }

    //Check if account is active
    // if(!user.is_active){
    //     throw new AppError(403, 'Account is deactivated');
    // }

    await updateLastLogin(user.user_id);

    const token = generateToken({
        user_id: user.user_id,
        username: user.username
    });

    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            avatar_url: user.avatar_url,
            dob: user.dob,
        },
    });
};