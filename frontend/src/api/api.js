import axios from 'axios';

export const authApi = axios.create({
    baseURL: 'https://chatgpt-project-almost-done.onrender.com/api/auth',
    withCredentials: true
})

export const chatApi = axios.create({
    baseURL: 'https://chatgpt-project-almost-done.onrender.com/api/chat',
    withCredentials: true
})

export const messageApi = axios.create({
    baseURL: 'https://chatgpt-project-almost-done.onrender.com/api/chat',
    withCredentials: true
})