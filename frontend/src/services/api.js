import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Make sure this matches your backend URL
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
API.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('API Response Error:', error.response ? error.response.status : 'Unknown', error.message);
        return Promise.reject(error);
    }
);

export default API;
