import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Đảm bảo không có khoảng trắng thừa (vấn đề hay gặp trên mobile)
        config.headers.Authorization = `Bearer ${token.trim()}`;
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
    const method = response.config.method.toLowerCase();
    
    if (method === 'get') {
        cache.set(url, { data: response.data, ts: Date.now() });
    } else if (['post', 'put', 'delete'].includes(method)) {
        // Clear entire cache on any mutation to ensure fresh data
        cache.clear();
        console.log('Cache cleared due to mutation');
    }
    return response;
}, (error) => {
    // Nếu gặp lỗi 401 (Hết hạn/Chưa đăng nhập) hoặc 403 (Không đủ quyền)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Xóa thông tin cũ
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Chuyển hướng về trang login nếu không phải đang ở đó
        // Thêm tham số expired=true để trang login có thể hiển thị thông báo "Phiên hết hạn"
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            window.location.href = '/login?expired=true';
        }
    }
    return Promise.reject(error);
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
    getAll: (categoryId, search, status, page, size) => {
        const params = {};
        if (categoryId) params.categoryId = categoryId;
        if (search) params.search = search;
        if (status) params.status = status;
        if (page !== undefined) params.page = page;
        if (size !== undefined) params.size = size;
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
