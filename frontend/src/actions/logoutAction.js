import { redirect } from 'react-router';
import useAuthStore from '../store/authStore';

export async function logoutAction(){
    useAuthStore.getState().logout();
    return redirect('/');
}