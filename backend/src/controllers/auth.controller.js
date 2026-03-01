import { generateToken} from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { findUserByEmail, createUser, updateLastLogin } from '../models/user.model.js';

export const register = async (req, res) => {
    
    try {      
        const {username, email, dob, password} = req.body;

        const existingUser = await findUserByEmail(email);
        if(existingUser){
            return res.status(400).json({message: 'Email already in use'});
        }

        const passwordHash = await hashPassword(password);
        const newUser = await createUser(username, email, dob, passwordHash);

        res.status(201).json({message: 'User created successfully'});

    } catch (err) {
        if (err.code === '23505') {
            if (err.constraint === 'users_username_key') {
                return res.status(400).json({ message: 'Username already taken' });
            }
            if (err.constraint === 'users_email_key') {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
        console.error(err);
        res.status(500).json({message: 'Error creating user!'});
    }
};

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if(!user){
            console.log('No user found with that email');
            return res.status(401).json({message: 'Invalid email or password'});
        }

        //Check if account is active
        // if(!user.is_active){
        //     return res.status(403).json({message: 'Account is deactivated'});
        // }

        const passwordMatch = await comparePassword(password, user.password_hash);
        if(!passwordMatch){
            return res.status(401).json({message: 'Invalid email or password'});
        }

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
                avatar_url: user.avatar_url
            }
        });

    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error loggin in.'})
    };
}