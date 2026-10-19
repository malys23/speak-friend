import { redirect } from 'react-router';
import useAuthStore from '../stores/authStore';

export async function logoutAction(){
    useAuthStore.getState().logout();
    return redirect('/');
}