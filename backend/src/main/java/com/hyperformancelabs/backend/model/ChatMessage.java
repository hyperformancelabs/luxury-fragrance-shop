package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a single message within a conversation.
 * Contains message content and metadata about sender and receiver.
 */
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
    @Pattern(regexp = "^(customer|employee|system|bot)$", 
             message = "Sender type must be customer, employee, system, or bot")
    private String senderType;
    
    @Column(name = "receiver_id")
    private Integer receiverId;
    
    @Column(name = "receiver_type", length = 20, nullable = false)
    @Pattern(regexp = "^(customer|employee|system|bot)$", 
             message = "Receiver type must be customer, employee, system, or bot")
    private String receiverType;
    
    @Column(name = "content", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    @NotBlank(message = "Content is required")
    private String content;
    
    @Column(name = "timestamp", nullable = false)
    @PastOrPresent(message = "Timestamp must be in the past or present")
    private LocalDateTime timestamp = LocalDateTime.now();
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;
}