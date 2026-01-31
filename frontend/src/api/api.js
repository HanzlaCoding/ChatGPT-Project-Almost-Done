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