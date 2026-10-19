import { redirect } from 'react-router';
import { register } from '../services/authService';

export async function registerAction({request}){
    const formData = await request.formData();
    const userData = {
        username: formData.get('username')?.toString().trim(),
        email: formData.get('email')?.toString().trim().toLowerCase(),
        dob: formData.get('dob') || null,
        password: formData.get('password')
    }

    try{
        await register(userData.username, userData.email, userData.dob, userData.password);

    } catch(err) {
        if(!err.response){
            return { error: 'Could not reach the server. Please try again.' };
        }
        return {error: err.response?.data?.message || 'Failed to create user.' };
    }

    return redirect('/auth/login');

}