import api from './api';

export const login = async (email, password) => {
    const response = await api.post('/api/auth/login', {email, password});

    return response.data;
}

export const register = async (username, email, dob, password) => {
    const response = await api.post('/api/auth/register', {username, email, dob, password});
        
    return response.data;
}

export const logout = async () => {
    localStorage.removeItem('token');
}