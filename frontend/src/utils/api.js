import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Send cookies with requests
});

export const checkAuth = async () => {
    try {
        const { data } = await api.get('/auth/me');
        return data.user;
    } catch (err) {
        return null; // Return null gracefully
    }
};

export const loginUser = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
};

export const registerUser = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
};

export const logoutUser = async () => {
    const { data } = await api.post('/auth/logout');
    return data;
};

export default api;
