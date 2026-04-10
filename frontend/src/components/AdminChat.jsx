import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';
import webSocketService from '../services/websocket';
import { Send, User as UserIcon, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminChat = ({ currentUser }) => {
    const { t } = useTranslation();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
        webSocketService.connect((message) => {
            // Handle incoming message
            if (selectedUser && (message.senderId === selectedUser.id || message.receiverId === selectedUser.id)) {
                setMessages(prev => [...prev, message]);
            }
            fetchConversations(); // Refresh contact list to show latest message/order
        });

        return () => {
            webSocketService.disconnect();
        };
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await chatService.getAdminConversations();
            setConversations(res.data);
        } catch (error) {
            console.error('Error fetching conversations', error);
        }
    };

    const fetchHistory = async (userId) => {
        try {
            const res = await chatService.getHistory(userId);
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching history', error);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        fetchHistory(user.id);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const messageDto = {
            senderId: currentUser.id,
            receiverId: selectedUser.id,
            content: newMessage,
        };

        webSocketService.sendMessage(messageDto);
        setMessages(prev => [...prev, { ...messageDto, senderUsername: currentUser.username, timestamp: new Date().toISOString() }]);
        setNewMessage('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const filteredConversations = conversations.filter(c => 
        c.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-250px)] bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-soft">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-100 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map(user => (
                            <button
                                key={user.id}
                                onClick={() => handleSelectUser(user)}
                                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedUser?.id === user.id ? 'bg-gray-50' : ''}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <UserIcon size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm text-primary">{user.username}</p>
                                    <p className="text-xs text-gray-500 truncate w-40">{user.email}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-400 text-sm">No conversations found</div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50/30">
                {selectedUser ? (
                    <>
                        <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                {selectedUser.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-primary">{selectedUser.username}</p>
                                <p className="text-xs text-green-500">Online</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === currentUser.id;
                                return (
                                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-black text-white rounded-tr-none' : 'bg-white text-primary rounded-tl-none'}`}>
                                            <p>{msg.content}</p>
                                            <p className={`text-[10px] mt-1 ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <UserIcon size={48} className="mb-4 opacity-20" />
                        <p>Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;
