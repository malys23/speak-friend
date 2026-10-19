import { redirect } from 'react-router';
import { login } from '../services/authService';
import useAuthStore from '../stores/authStore';
import { connectSocket } from '../utils/socket';

export async function loginAction({request}){
    
    const formData = await request.formData();
    const authData = {
        email: formData.get('email')?.toString().trim().toLowerCase(),
        password: formData.get('password')
    }

    let data;
    try{
        data = await login(authData.email, authData.password);
    } catch (err) {
        if (!err.response){
            return {error: 'Could not reach the server. Please try again.'};
        }
        return {error: err.response.data?.message || 'Invalid username or password'};
    }

    useAuthStore.getState().login(data.user, data.token);
    try{
        await connectSocket();
    } catch (err) {
        console.error('Socket connection failed:', err);
    }

    return redirect('/dungeon');

}