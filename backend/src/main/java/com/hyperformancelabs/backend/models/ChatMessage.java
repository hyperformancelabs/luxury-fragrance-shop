package com.hyperformancelabs.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ChatMessage")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_message_id")
    private Integer chatMessageId;
    
    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;
    
    @Column(name = "sender_id")
    private Integer senderId;
    
    @Column(name = "sender_type", length = 20, nullable = false)
    private String senderType;
    
    @Column(name = "receiver_id")
    private Integer receiverId;
    
    @Column(name = "receiver_type", length = 20, nullable = false)
    private String receiverType;
    
    @Column(name = "content", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String content;
    
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
} 