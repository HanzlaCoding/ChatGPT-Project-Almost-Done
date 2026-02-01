import axios from 'axios';

export const authApi = axios.create({
    baseURL: '/api/auth',
    withCredentials: true
})

export const chatApi = axios.create({
    baseURL: '/api/chat',
    withCredentials: true
})

export const messageApi = axios.create({
    baseURL: '/api/chat',
    withCredentials: true
})

// Function to handle 401 Unauthorized errors
const handleUnauthorized = (error) => {
    if (error.response && error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
};

// Apply interceptors to protected APIs
chatApi.interceptors.response.use(
    (response) => response,
    handleUnauthorized
);

messageApi.interceptors.response.use(
    (response) => response,
    handleUnauthorized
);