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

export const productService = {
    getAll: (categoryId, search) => {
        const params = {};
        if (categoryId) params.categoryId = categoryId;
        if (search) params.search = search;
        return api.get('/products', { params });
    },
    getById: (id) => api.get(`/products/${id}`),
    create: (formData) => api.post('/products', formData),
    update: (id, formData) => api.put(`/products/${id}`, formData),
    delete: (id) => api.delete(`/products/${id}`),
    getOne: (id) => api.get(`/products/${id}`),
};

export const categoryService = {
    getAll: () => api.get('/categories'),
};

export const orderService = {
    create: (orderData) => api.post('/orders', orderData),
};

export default api;
