package com.hyperformancelabs.backend.controller;

import com.hyperformancelabs.backend.dto.ProductDTO;
import com.hyperformancelabs.backend.dto.ProductFilterDTO;
import com.hyperformancelabs.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    
    @PostMapping("/filter")
    public ResponseEntity<Map<String, Object>> filterProducts(@RequestBody ProductFilterDTO filterDTO) {
        Page<ProductDTO> productPage = productService.findProductsWithFilters(filterDTO);
        
        Map<String, Object> response = new HashMap<>();
        response.put("products", productPage.getContent());
        response.put("currentPage", productPage.getNumber());
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/filter-options")
    public ResponseEntity<Map<String, List<String>>> getFilterOptions() {
        Map<String, List<String>> filterOptions = new HashMap<>();
        
        // Get distinct values for each filter type
        filterOptions.put("toneScents", productService.getDistinctDetailValues("tone_scent"));
        filterOptions.put("styles", productService.getDistinctDetailValues("style"));
        filterOptions.put("suitableGenders", productService.getDistinctDetailValues("suitable_gender"));
        
        return ResponseEntity.ok(filterOptions);
    }
}
