import { useEffect } from 'react';
import { Navigate } from 'react-router';
import useAuthStore from '../../stores/authStore';
import { connectSocket } from '../../utils/socket';

export default function ProtectedRoute({children}){
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            connectSocket().catch((err) =>
                console.error('Socket connection failed:', err)
            );
        }
    }, [isAuthenticated]);

    if(!isAuthenticated){
        return <Navigate to="/auth/login" replace/>;
    }

    return children;
}