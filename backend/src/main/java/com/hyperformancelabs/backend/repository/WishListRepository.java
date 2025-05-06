package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Customer;
import com.hyperformancelabs.backend.model.ProductVariant;
import com.hyperformancelabs.backend.model.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishListRepository extends JpaRepository<WishList, Integer> {
    List<WishList> findByCustomer(Customer customer);

    boolean existsByCustomerAndProductVariant(Customer customer, ProductVariant variant);

}
