package com.hyperformancelabs.backend.dto;

import com.hyperformancelabs.backend.model.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private Integer chatMessageId;
    private String senderType;
    private Integer senderId;
    private String receiverType;
    private Integer receiverId;
    private String content;
    private LocalDateTime timestamp;

    public static ChatMessageDTO fromEntity(ChatMessage m) {
        return new ChatMessageDTO(
                m.getChatMessageId(),
                m.getSenderType(),
                m.getSenderId(),
                m.getReceiverType(),
                m.getReceiverId(),
                m.getContent(),
                m.getTimestamp()
        );
    }
} 