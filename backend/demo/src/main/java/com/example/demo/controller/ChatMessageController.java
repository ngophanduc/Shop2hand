package com.example.demo.controller;

import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.entity.User;
import com.example.demo.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatMessageController {

    @Autowired
    private ChatMessageService chatMessageService;

    @Autowired
    private com.example.demo.repository.UserRepository userRepository;

    @GetMapping("/history/{userId}")
    public List<ChatMessageDTO> getHistory(@PathVariable Long userId) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User currentUser = userRepository.findByUsername(username).orElseThrow();
        return chatMessageService.getConversation(currentUser.getId(), userId);
    }

    @GetMapping("/admin/conversations")
    public List<User> getAdminConversations() {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User admin = userRepository.findByUsername(username).orElseThrow();
        if (admin.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Unauthorized");
        }
        return chatMessageService.getAdminContacts(admin.getId());
    }

    @MessageMapping("/chat.send")
    public void processMessage(@Payload ChatMessageDTO messageDTO) {
        chatMessageService.sendMessage(messageDTO.getSenderId(), messageDTO.getReceiverId(), messageDTO.getContent());
    }
}
