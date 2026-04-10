package com.example.demo.repository;

import com.example.demo.entity.ChatMessage;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.sender.id = :user1Id AND m.receiver.id = :user2Id) OR " +
           "(m.sender.id = :user2Id AND m.receiver.id = :user1Id) " +
           "ORDER BY m.timestamp ASC")
    List<ChatMessage> findConversation(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);

    @Query("SELECT DISTINCT m.sender FROM ChatMessage m WHERE m.receiver.id = :adminId ORDER BY m.timestamp DESC")
    List<User> findContactsForAdmin(@Param("adminId") Long adminId);
    
    // Better query to get users who have messaged admin or admin has messaged them
    @Query("SELECT DISTINCT u FROM User u WHERE u.role = :userRole AND " +
           "EXISTS (SELECT m FROM ChatMessage m WHERE " +
           "(m.sender = u AND m.receiver.id = :adminId) OR " +
           "(m.sender.id = :adminId AND m.receiver = u))")
    List<User> findAllUsersInConversations(@Param("adminId") Long adminId, @Param("userRole") User.Role userRole);
}
