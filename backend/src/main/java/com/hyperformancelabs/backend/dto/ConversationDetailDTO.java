package com.hyperformancelabs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDetailDTO {
    private Integer conversationId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String rating;
    private String channel;
    private List<ChatMessageDTO> messages;
} 