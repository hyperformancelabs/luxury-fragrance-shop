package com.hyperformancelabs.backend.service;

import com.hyperformancelabs.backend.dto.AddToWishListRequest;
import com.hyperformancelabs.backend.dto.WishListItemResponse;
import com.hyperformancelabs.backend.model.Customer;

import java.util.List;

public interface WishListService {
//    List<WishListItemResponse> getAllWishlist();

    List<WishListItemResponse> getAllWishlist(String token);
;
    void addToWishlist(Customer customer, AddToWishListRequest request);

    void moveAllToCart(String token);

    void removeFromWishlist(String token, Integer productVariantId);

    void clearWishlist(String token);

    void moveItemToCart(String token, Integer productVariantId);

}

