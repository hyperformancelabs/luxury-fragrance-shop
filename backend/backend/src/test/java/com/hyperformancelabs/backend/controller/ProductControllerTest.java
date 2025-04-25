package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.model.Product;
import com.hyperformancelabs.backend.service.impl.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

public class ProductControllerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllProducts() {
        // Create a list of mock products
        List<Product> productList = new ArrayList<>();
        Product product = new Product();
        product.setProductId(1);
        product.setProductName("Test Perfume");
        product.setVolume(100);
        product.setPrice(new BigDecimal("99.99"));
        product.setQuantityInStock(10);
        productList.add(product);

        // Create a mock Page of products
        Page<Product> productPage = new PageImpl<>(productList);

        // Mock the service method
        when(productService.getAllProducts(0)).thenReturn(productPage);

        // Call the controller method
        ResponseEntity<Map<String, Object>> response = productController.getAllProducts(0);

        // Verify the response
        assertEquals(200, response.getStatusCodeValue());
        
        Map<String, Object> responseBody = response.getBody();
        assertNotNull(responseBody);
        assertEquals("success", responseBody.get("status"));
        assertEquals("Get all products successfully", responseBody.get("message"));
        
        Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
        assertNotNull(data);
        
        List<Product> items = (List<Product>) data.get("items");
        assertNotNull(items);
        assertEquals(1, items.size());
        
        Product returnedProduct = items.get(0);
        assertEquals(1, returnedProduct.getProductId());
        assertEquals("Test Perfume", returnedProduct.getProductName());
        assertEquals(100, returnedProduct.getVolume());
        assertEquals(0, new BigDecimal("99.99").compareTo(returnedProduct.getPrice()));
        assertEquals(10, returnedProduct.getQuantityInStock());
    }
}
