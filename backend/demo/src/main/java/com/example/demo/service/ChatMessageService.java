package com.example.demo.service;

import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.entity.ChatMessage;
import com.example.demo.entity.User;
import com.example.demo.repository.ChatMessageRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ChatMessageDTO sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();

        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .isRead(false)
                .build();

        message = chatMessageRepository.save(message);
        ChatMessageDTO dto = mapToDTO(message);

        // Send real-time if receiver is online (via user-specific queue)
        messagingTemplate.convertAndSendToUser(receiver.getUsername(), "/queue/messages", dto);

        return dto;
    }

    public List<ChatMessageDTO> getConversation(Long user1Id, Long user2Id) {
        return chatMessageRepository.findConversation(user1Id, user2Id).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<User> getAdminContacts(Long adminId) {
        return chatMessageRepository.findAllUsersInConversations(adminId, User.Role.USER);
    }

    private ChatMessageDTO mapToDTO(ChatMessage message) {
        return ChatMessageDTO.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderUsername(message.getSender().getUsername())
                .receiverId(message.getReceiver().getId())
                .receiverUsername(message.getReceiver().getUsername())
                .content(message.getContent())
                .isRead(message.isRead())
                .timestamp(message.getTimestamp() != null ? message.getTimestamp().toString() : "")
                .build();
    }
}
