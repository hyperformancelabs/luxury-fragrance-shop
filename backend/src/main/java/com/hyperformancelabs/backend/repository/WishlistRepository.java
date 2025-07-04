package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    List<Wishlist> findByCustomer_CustomerId(Integer customerId);
} 