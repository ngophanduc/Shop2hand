import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
    }

    connect(onMessageReceived) {
        const socket = new SockJS('/ws');
        this.client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');
                // Subscribe to user-specific queue
                const subscription = this.client.subscribe('/user/queue/messages', (message) => {
                    onMessageReceived(JSON.parse(message.body));
                });
                this.subscriptions.set('messages', subscription);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        this.client.activate();
    }

    sendMessage(message) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: '/app/chat.send',
                body: JSON.stringify(message),
            });
        } else {
            console.error('Cannot send message, not connected');
        }
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
        }
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
