import { Navigate } from 'react-router';
import useAuthStore from '../stores/authStore';

export default function ProtectedRoute({children}){
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const token = localStorage.getItem('token');

    if(!isAuthenticated && !token){
        return <Navigate to='/auth/login'/>;
    }

    return children;
}