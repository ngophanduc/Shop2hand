import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';
import webSocketService from '../services/websocket';
import { MessageCircle, X, Send, User as UserIcon } from 'lucide-react';

const ChatWidget = ({ currentUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [admin, setAdmin] = useState({ id: 1, username: 'admin' }); // Default admin, should fetch if dynamic
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (currentUser && isOpen) {
            fetchHistory();
            webSocketService.connect((message) => {
                if (message.senderId === admin.id || message.receiverId === admin.id) {
                    setMessages(prev => [...prev, message]);
                }
            });
        }
        
        return () => {
            if (isOpen) webSocketService.disconnect();
        };
    }, [currentUser, isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchHistory = async () => {
        try {
            const res = await chatService.getHistory(admin.id);
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching history', error);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        const messageDto = {
            senderId: currentUser.id,
            receiverId: admin.id,
            content: newMessage,
        };

        webSocketService.sendMessage(messageDto);
        setMessages(prev => [...prev, { ...messageDto, senderUsername: currentUser.username, timestamp: new Date().toISOString() }]);
        setNewMessage('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!currentUser || currentUser.role === 'ADMIN') return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {isOpen ? (
                <div className="bg-white w-80 sm:w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="p-4 bg-black text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <UserIcon size={16} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Passgiay.shop Support</p>
                                <p className="text-[10px] text-gray-400">Usually replies in minutes</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50/50">
                        {messages.map((msg, index) => {
                            const isMe = msg.senderId === currentUser.id;
                            return (
                                <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs shadow-sm ${isMe ? 'bg-black text-white rounded-tr-none' : 'bg-white text-primary rounded-tl-none'}`}>
                                        <p>{msg.content}</p>
                                        <p className={`text-[8px] mt-1 ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs focus:ring-1 focus:ring-black outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all group relative"
                >
                    <MessageCircle size={24} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white scale-0 group-hover:scale-100 transition-transform"></span>
                </button>
            )}
        </div>
    );
};

export default ChatWidget;
