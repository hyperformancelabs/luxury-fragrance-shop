package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Integer> {
    @Query("SELECT DISTINCT c FROM Conversation c JOIN c.chatMessages m WHERE (m.senderType='customer' AND m.senderId=:custId) OR (m.receiverType='customer' AND m.receiverId=:custId)")
    List<Conversation> findByCustomerId(@Param("custId") Integer customerId);
}
