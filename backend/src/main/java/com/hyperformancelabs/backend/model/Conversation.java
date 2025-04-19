package com.hyperformancelabs.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a conversation between a customer and customer support.
 * Tracks chat session details and messages.
 */
@Entity
@Table(name = "Conversation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conversation_id")
    private Integer conversationId;
    
    @Column(name = "start_time", nullable = false)
    @PastOrPresent(message = "Start time must be in the past or present")
    private LocalDateTime startTime = LocalDateTime.now();
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Column(name = "status", length = 20, nullable = false)
    @Pattern(regexp = "^(active|closed)$", message = "Status must be active or closed")
    private String status = "active";
    
    @Column(name = "rating", length = 20)
    @Pattern(regexp = "^(excellent|good|neutral|poor|very_poor)$", 
             message = "Rating must be excellent, good, neutral, poor, or very_poor")
    private String rating;
    
    @Column(name = "channel", length = 50)
    private String channel;
    
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ChatMessage> chatMessages = new HashSet<>();
}