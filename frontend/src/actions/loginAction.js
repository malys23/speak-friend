import { redirect } from 'react-router-dom';
import { login } from '../services/authService';
import useAuthStore from '../store/authStore';
import { connectSocket } from '../utils/socket';

export async function loginAction({request}){
    
    const formData = await request.formData();
    const authData = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    try{
        const data = await login(authData.email, authData.password);

        localStorage.setItem('token', data.token);
        useAuthStore.getState().login(data.user, data.token);

        await connectSocket();
        console.log('Socket ready, redirecting to dungeon');

        return redirect('/dungeon');

    } catch(err){
        const errorMessage = err.response?.data?.message || 'Invalid username or password';
        return {error: errorMessage };
    };
}