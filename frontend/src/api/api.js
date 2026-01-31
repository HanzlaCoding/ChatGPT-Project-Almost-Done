import axios from 'axios';

export const authApi = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials: true
})

export const chatApi = axios.create({
    baseURL: 'http://localhost:3000/api/chat',
    withCredentials: true
})

export const messageApi = axios.create({
    baseURL: 'http://localhost:3000/api/chat',
    withCredentials: true
})