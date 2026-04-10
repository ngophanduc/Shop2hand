import axios from 'axios';

const API_BAR_URL = '/api/chat';

export const chatService = {
    getHistory: (userId) => axios.get(`${API_BAR_URL}/history/${userId}`),
    getAdminConversations: () => axios.get(`${API_BAR_URL}/admin/conversations`),
};
