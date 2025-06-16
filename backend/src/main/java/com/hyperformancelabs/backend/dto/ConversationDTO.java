package com.hyperformancelabs.backend.dto;

import com.hyperformancelabs.backend.model.Conversation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private Integer conversationId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String rating;
    private String channel;

    public static ConversationDTO fromEntity(Conversation c) {
        return new ConversationDTO(c.getConversationId(), c.getStartTime(), c.getEndTime(), c.getStatus(), c.getRating(), c.getChannel());
    }
} 