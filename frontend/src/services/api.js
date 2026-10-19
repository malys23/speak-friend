import axios from 'axios';
import useAuthStore from '../stores/authStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
    timout: 10000,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//temp debug
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url ?? '';
        const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register');

        if(error.response?.status === 401 && !isAuthRequest){
            useAuthStore.getState().logout();
            window.location.assign('/auth/login');
        }
        return Promise.reject(error);
    }
);


export default api;