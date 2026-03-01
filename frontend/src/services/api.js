import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

console.log('API baseURL', import.meta.env.VITE_API_URL);

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('Request config:', config.url, config.method);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//temp debug
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status, response.data);
        return response;
    },
    (error) => {
        console.log('Response error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);


export default api;