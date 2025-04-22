package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Cart;
import com.hyperformancelabs.backend.model.CartItem;
import com.hyperformancelabs.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    /**
     * Find all items in a cart
     */
    List<CartItem> findByCart(Cart cart);

    /**
     * Find a specific item in a cart by product
     */
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

    /**
     * Delete all items in a cart
     */
    void deleteByCart(Cart cart);

    /**
     * Count items in a cart
     */
    long countByCart(Cart cart);

    /**
     * Update item quantity
     */
    @Modifying
    @Query("UPDATE CartItem ci SET ci.quantity = :quantity WHERE ci.cartItemId = :cartItemId")
    void updateQuantity(@Param("cartItemId") Integer cartItemId, @Param("quantity") Integer quantity);

    /**
     * Update item selection status
     */
    @Modifying
    @Query("UPDATE CartItem ci SET ci.isSelected = :isSelected WHERE ci.cartItemId = :cartItemId")
    void updateSelectionStatus(@Param("cartItemId") Integer cartItemId, @Param("isSelected") Boolean isSelected);
}
