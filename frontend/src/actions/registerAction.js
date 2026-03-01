import { redirect } from 'react-router';
import { register } from '../services/authService';

export async function registerAction({request}){
    const formData = await request.formData();
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        dob: formData.get('dob'),
        password: formData.get('password')
    }

    try{
        await register(userData.username, userData.email, userData.dob, userData.password);
        
        return redirect('/auth/login');

    } catch(err) {
        const errorMessage = err.response?.data?.message || 'Failed to create user.';
        return {error: errorMessage}
    }

}