import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => localStorage.removeItem('token'),
};

// Simple in-memory cache (60 giây)
const cache = new Map();
const CACHE_TTL = 60_000;

api.interceptors.response.use((response) => {
    const url = response.config.url + (response.config.params ? JSON.stringify(response.config.params) : '');
    if (response.config.method === 'get') {
        cache.set(url, { data: response.data, ts: Date.now() });
    }
    return response;
});

api.interceptors.request.use((config) => {
    if (config.method === 'get') {
        const url = config.url + (config.params ? JSON.stringify(config.params) : '');
        const cached = cache.get(url);
        if (cached && Date.now() - cached.ts < CACHE_TTL) {
            // Trả về cached response dưới dạng cancelled request trick
            config.adapter = () => Promise.resolve({
                data: cached.data,
                status: 200,
                statusText: 'OK (cached)',
                headers: {},
                config,
            });
        }
    }
    return config;
});

export const productService = {
    getAll: (categoryId, search) => {
        const params = {};
        if (categoryId) params.categoryId = categoryId;
        if (search) params.search = search;
        return api.get('/products', { params });
    },
    getFeatured: () => api.get('/products/featured'),
    getById: (id) => api.get(`/products/${id}`),
    getOne: (id) => api.get(`/products/${id}`),
    create: (formData) => api.post('/products', formData),
    update: (id, formData) => api.put(`/products/${id}`, formData),
    delete: (id) => api.delete(`/products/${id}`),
};

export const categoryService = {
    getAll: () => api.get('/categories'),
};

export const orderService = {
    create: (orderData) => api.post('/orders', orderData),
};

export default api;
