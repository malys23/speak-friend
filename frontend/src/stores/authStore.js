import { create } from 'zustand';
import { disconnectSocket } from '../utils/socket';

const decodeToken = (token) => {
    try{
        const base64URL = token.split('.')[1];
        const base64 = base64URL.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));

    }catch {
        return null;
    }  
};

const getExistingAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) return {user: null, token: null, isAuthenticated: false};

    const decoded = decodeToken(token);
    if(!decoded || decoded.exp * 1000 < Date.now()){
        localStorage.removeItem('token');
        return {user: null, token: null, isAuthenticated: false};
    }

    return {
        user: {user_id: decoded.user_id, username: decoded.username},
        token,
        isAuthenticated: true
    };
};

const useAuthStore = create((set) => ({
    ...getExistingAuth(),

    login: (user, token) =>{ 
        localStorage.setItem('token', token);
        set ({user, token, isAuthenticated: true});
    },

    logout: () => {
        localStorage.removeItem('token');
        disconnectSocket();
        set({
            user: null,
            token: null,
            isAuthenticated: false
        });
    },

    updateUser: (updateUser) => set((state) => ({
        user: {...state.user, ...updateUser}
    }))
}));

export default useAuthStore;