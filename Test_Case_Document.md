# Test Case Document - Luxury Fragrance Shop

## Project Overview
This document outlines comprehensive test cases for the luxury fragrance shop application, covering both backend API endpoints and frontend user interface functionality. The testing focuses on the three most critical features: **User Authentication**, **Shopping Cart Management**, and **Product Browsing & Search**.

---

## Feature 1: User Authentication

### General Description
Users can register new accounts and log into the system using their credentials. The system uses JWT tokens for authentication and maintains user sessions.

### Backend Information (API)
- **Registration Endpoint:** `POST /api/v1/auth/register`
- **Login Endpoint:** `POST /api/v1/auth/login`
- **Authentication:** JWT token-based with Bearer authorization

### Frontend Information (UI/UX)
- **Registration Flow:** Users can register via navbar modal with form validation
- **Login Flow:** Users can login via navbar modal or dedicated `/login` page
- **Session Management:** JWT tokens stored in localStorage with automatic redirection

---

## Unit Tests

### UT_AUTH_01
- **Feature Under Test:** User Registration
- **Test Objective:** Verify that the registration service correctly validates and creates a new user account
- **Pre-conditions:** Database is accessible and no existing user with test credentials
- **Test Steps:**
  1. Call `customerService.register()` with valid RegisterRequest
  2. Verify password encoding is applied
  3. Verify customer is saved to database
  4. Verify wishlist is created for new customer
- **Expected Result:** CustomerResponseDTO returned with user details, password encrypted, wishlist created
- **Test Type:** Positive
- **Code Example:**
```java
@Test
public void testRegisterCustomer_Success() {
    // Arrange
    RegisterRequest request = new RegisterRequest();
    request.setUsername("testuser");
    request.setPassword("password123");
    request.setName("Test User");
    request.setEmail("test@example.com");
    request.setPhoneNumber("0123456789");

    // Act
    CustomerResponseDTO result = customerService.register(request);

    // Assert
    assertNotNull(result);
    assertEquals("testuser", result.getUsername());
    assertEquals("Test User", result.getName());
    assertEquals("test@example.com", result.getEmail());

    // Verify password is encoded
    Customer savedCustomer = customerRepository.findByUsername("testuser").get();
    assertTrue(passwordEncoder.matches("password123", savedCustomer.getPassword()));

    // Verify wishlist created
    Optional<WishList> wishlist = wishListRepository.findByCustomer(savedCustomer);
    assertTrue(wishlist.isPresent());
}
```
- **Expected Response:**
```json
{
  "customerId": 1,
  "username": "testuser",
  "name": "Test User",
  "email": "test@example.com",
  "phoneNumber": "0123456789"
}
```

### UT_AUTH_02
- **Feature Under Test:** User Login
- **Test Objective:** Verify that the login service correctly authenticates valid credentials
- **Pre-conditions:** Valid user exists in database
- **Test Steps:**
  1. Call `customerService.loginAndGenerateToken()` with valid LoginRequest
  2. Verify password matching using BCrypt
  3. Verify JWT token generation with correct claims
- **Expected Result:** Valid JWT token returned containing username, customerId, and role claims
- **Test Type:** Positive
- **Code Example:**
```java
@Test
public void testLoginAndGenerateToken_Success() {
    // Arrange
    Customer existingCustomer = new Customer();
    existingCustomer.setUsername("testuser");
    existingCustomer.setPassword(passwordEncoder.encode("password123"));
    existingCustomer.setCustomerId(1);
    customerRepository.save(existingCustomer);

    LoginRequest request = new LoginRequest();
    request.setUsername("testuser");
    request.setPassword("password123");

    // Act
    String token = customerService.loginAndGenerateToken(request);

    // Assert
    assertNotNull(token);
    assertTrue(jwtUtil.validateToken(token));
    assertEquals("testuser", jwtUtil.getUsernameFromToken(token));
    assertEquals(Integer.valueOf(1), jwtUtil.getCustomerIdFromToken(token));
}
```
- **Expected Response:**
```
"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImN1c3RvbWVySWQiOjEsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcwMzI1NjAwMCwiZXhwIjoxNzAzMzQyNDAwfQ.signature"
```

### UT_AUTH_03
- **Feature Under Test:** JWT Token Validation
- **Test Objective:** Verify that JWT utility correctly validates token integrity
- **Pre-conditions:** Valid JWT token exists
- **Test Steps:**
  1. Call `jwtUtil.validateToken()` with valid token
  2. Call `jwtUtil.getUsernameFromToken()` to extract username
  3. Call `jwtUtil.getCustomerIdFromToken()` to extract customer ID
- **Expected Result:** Token validation returns true, username and customer ID extracted correctly
- **Test Type:** Positive
- **Code Example:**
```java
@Test
public void testJwtTokenValidation_Success() {
    // Arrange
    String token = jwtUtil.generateToken(1, "testuser");

    // Act & Assert
    assertTrue(jwtUtil.validateToken(token));
    assertEquals("testuser", jwtUtil.getUsernameFromToken(token));
    assertEquals(Integer.valueOf(1), jwtUtil.getCustomerIdFromToken(token));
}

@Test
public void testJwtTokenValidation_InvalidToken() {
    // Arrange
    String invalidToken = "invalid.token.here";

    // Act & Assert
    assertFalse(jwtUtil.validateToken(invalidToken));
    assertThrows(JwtException.class, () -> {
        jwtUtil.getUsernameFromToken(invalidToken);
    });
}
```
- **Expected Response:**
```java
// For valid token
boolean isValid = true;
String username = "testuser";
Integer customerId = 1;

// For invalid token
boolean isValid = false;
// Exception thrown: JwtException
```

### UT_AUTH_04
- **Feature Under Test:** Registration Input Validation
- **Test Objective:** Verify that registration fails with invalid input data
- **Pre-conditions:** Database is accessible
- **Test Steps:**
  1. Call `customerService.register()` with empty username
  2. Call `customerService.register()` with invalid email format
  3. Call `customerService.register()` with existing username
- **Expected Result:** RuntimeException thrown with appropriate error messages
- **Test Type:** Negative
- **Code Example:**
```java
@Test
public void testRegisterCustomer_EmptyUsername() {
    // Arrange
    RegisterRequest request = new RegisterRequest();
    request.setUsername("");
    request.setPassword("password123");
    request.setName("Test User");
    request.setEmail("test@example.com");
    request.setPhoneNumber("0123456789");

    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class, () -> {
        customerService.register(request);
    });
    assertEquals("Username không được để trống", exception.getMessage());
}

@Test
public void testRegisterCustomer_InvalidEmail() {
    // Arrange
    RegisterRequest request = new RegisterRequest();
    request.setUsername("testuser");
    request.setPassword("password123");
    request.setName("Test User");
    request.setEmail("invalid-email");
    request.setPhoneNumber("0123456789");

    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class, () -> {
        customerService.register(request);
    });
    assertEquals("Email không đúng định dạng", exception.getMessage());
}

@Test
public void testRegisterCustomer_ExistingUsername() {
    // Arrange - Create existing user
    Customer existingCustomer = new Customer();
    existingCustomer.setUsername("testuser");
    existingCustomer.setEmail("existing@example.com");
    customerRepository.save(existingCustomer);

    RegisterRequest request = new RegisterRequest();
    request.setUsername("testuser");
    request.setPassword("password123");
    request.setName("Test User");
    request.setEmail("test@example.com");
    request.setPhoneNumber("0123456789");

    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class, () -> {
        customerService.register(request);
    });
    assertEquals("Username đã tồn tại", exception.getMessage());
}
```
- **Expected Response:**
```java
// Exception messages
"Username không được để trống"
"Email không đúng định dạng"
"Username đã tồn tại"
```

### UT_CART_01
- **Feature Under Test:** Add Product to Cart
- **Test Objective:** Verify that cart service correctly adds products to user's cart
- **Pre-conditions:** Valid customer and product variant exist
- **Test Steps:**
  1. Call `cartService.addProductToCart()` with valid AddToCartRequest
  2. Verify cart creation if none exists
  3. Verify cart item creation with correct quantity and price
- **Expected Result:** Product added to cart, cart total updated, cart item saved to database
- **Test Type:** Positive
- **Code Example:**
```java
@Test
public void testAddProductToCart_Success() {
    // Arrange
    Customer customer = new Customer();
    customer.setCustomerId(1);
    customer.setUsername("testuser");

    ProductVariant productVariant = new ProductVariant();
    productVariant.setProductVariantId(1);
    productVariant.setPrice(new BigDecimal("1500000"));
    productVariant.setStockQuantity(10);

    AddToCartRequest request = new AddToCartRequest();
    request.setProductVariantId(1);
    request.setQuantity(2);
    request.setNote("Gift wrapping");

    when(productVariantRepository.findById(1)).thenReturn(Optional.of(productVariant));
    when(cartRepository.findByCustomerAndStatus(customer, "active")).thenReturn(Optional.empty());

    // Act
    cartService.addProductToCart(customer, request);

    // Assert
    verify(cartRepository, times(1)).save(any(Cart.class));
    verify(cartItemRepository, times(1)).save(any(CartItem.class));
}
```
- **Expected Response:**
```java
// Cart created with:
Cart cart = {
    "cartId": 1,
    "customer": customer,
    "status": "active",
    "totalAmount": 3000000.00
}

// CartItem created with:
CartItem cartItem = {
    "cartItemId": 1,
    "cart": cart,
    "productVariant": productVariant,
    "quantity": 2,
    "unitPrice": 1500000.00,
    "note": "Gift wrapping"
}
```

### UT_CART_02
- **Feature Under Test:** Update Cart Item Quantity
- **Test Objective:** Verify that cart service correctly updates item quantities
- **Pre-conditions:** Cart item exists for customer
- **Test Steps:**
  1. Call `cartService.updateCartItemQuantity()` with valid UpdateCartItemRequest
  2. Verify quantity validation (1-10 range)
  3. Verify cart total recalculation
- **Expected Result:** Cart item quantity updated, cart total recalculated correctly
- **Test Type:** Positive
- **Code Example:**
```java
@Test
public void testUpdateCartItemQuantity_Success() {
    // Arrange
    Customer customer = new Customer();
    customer.setCustomerId(1);

    Cart cart = new Cart();
    cart.setCartId(1);
    cart.setCustomer(customer);
    cart.setTotalAmount(new BigDecimal("1500000"));

    CartItem cartItem = new CartItem();
    cartItem.setCartItemId(1);
    cartItem.setCart(cart);
    cartItem.setQuantity(1);
    cartItem.setUnitPrice(new BigDecimal("1500000"));

    UpdateCartItemRequest request = new UpdateCartItemRequest();
    request.setCartItemId(1);
    request.setNewQuantity(3);
    request.setProductVariantId(1);

    when(cartItemRepository.findById(1)).thenReturn(Optional.of(cartItem));

    // Act
    cartService.updateCartItemQuantity(customer, request);

    // Assert
    assertEquals(3, cartItem.getQuantity());
    verify(cartItemRepository, times(1)).save(cartItem);
    verify(cartRepository, times(1)).save(cart);
}
```
- **Expected Response:**
```java
// Updated CartItem:
CartItem updatedItem = {
    "cartItemId": 1,
    "quantity": 3,
    "unitPrice": 1500000.00
}

// Updated Cart total:
Cart updatedCart = {
    "cartId": 1,
    "totalAmount": 4500000.00
}
```

### UT_CART_03
- **Feature Under Test:** Remove Item from Cart
- **Test Objective:** Verify that cart service correctly removes items from cart
- **Pre-conditions:** Cart item exists for customer
- **Test Steps:**
  1. Call `cartService.removeItemFromCart()` with valid parameters
  2. Verify cart item is deleted from database
  3. Verify cart total is recalculated
- **Expected Result:** Cart item removed, cart total updated correctly
- **Test Type:** Positive
- **Code Example:**
```java
@Test
public void testRemoveItemFromCart_Success() {
    // Arrange
    String username = "testuser";
    Integer productVariantId = 1;

    Customer customer = new Customer();
    customer.setUsername(username);

    Cart cart = new Cart();
    cart.setTotalAmount(new BigDecimal("3000000"));

    CartItem cartItem = new CartItem();
    cartItem.setCart(cart);
    cartItem.setQuantity(2);
    cartItem.setUnitPrice(new BigDecimal("1500000"));

    when(customerRepository.findByUsername(username)).thenReturn(Optional.of(customer));
    when(cartRepository.findByCustomerAndStatus(customer, "active")).thenReturn(Optional.of(cart));
    when(cartItemRepository.findByCartAndProductVariant_ProductVariantId(cart, productVariantId))
        .thenReturn(Optional.of(cartItem));

    // Act
    cartService.removeItemFromCart(username, productVariantId);

    // Assert
    verify(cartItemRepository, times(1)).delete(cartItem);
    verify(cartRepository, times(1)).save(cart);
}
```
- **Expected Response:**
```java
// CartItem deleted from database
// Cart total recalculated:
Cart updatedCart = {
    "cartId": 1,
    "totalAmount": 0.00
}
```

### UT_PRODUCT_01
- **Feature Under Test:** Product Search
- **Test Objective:** Verify that product service correctly searches products by name
- **Pre-conditions:** Products exist in database
- **Test Steps:**
  1. Call `productService.searchProductsByName()` with valid keyword
  2. Verify pagination parameters are applied
  3. Verify search results contain keyword in product name
- **Expected Result:** Page of ProductCard objects returned matching search criteria
- **Test Type:** Positive
- **Code Example:**
```java
@Test
public void testSearchProductsByName_Success() {
    // Arrange
    String keyword = "perfume";
    Pageable pageable = PageRequest.of(0, 10);

    List<ProductCard> mockProducts = Arrays.asList(
        new ProductCard(1, "Chanel Perfume", "luxury-perfume.jpg", new BigDecimal("2500000")),
        new ProductCard(2, "Dior Perfume", "dior-perfume.jpg", new BigDecimal("2800000"))
    );

    Page<ProductCard> mockPage = new PageImpl<>(mockProducts, pageable, 2);

    when(productRepository.searchByProductNameContainingIgnoreCase(keyword, pageable))
        .thenReturn(mockPage);

    // Act
    Page<ProductCard> result = productService.searchProductsByName(keyword, pageable);

    // Assert
    assertEquals(2, result.getContent().size());
    assertEquals(0, result.getNumber());
    assertEquals(10, result.getSize());
    assertEquals(2, result.getTotalElements());

    result.getContent().forEach(product -> {
        assertTrue(product.getProductName().toLowerCase().contains(keyword.toLowerCase()));
    });
}
```
- **Expected Response:**
```java
Page<ProductCard> result = {
    "content": [
        {
            "productId": 1,
            "productName": "Chanel Perfume",
            "imageUrl": "luxury-perfume.jpg",
            "price": 2500000.00
        },
        {
            "productId": 2,
            "productName": "Dior Perfume",
            "imageUrl": "dior-perfume.jpg",
            "price": 2800000.00
        }
    ],
    "pageable": {
        "pageNumber": 0,
        "pageSize": 10
    },
    "totalElements": 2,
    "totalPages": 1
}
```

### UT_PRODUCT_02
- **Feature Under Test:** Product Filter
- **Test Objective:** Verify that product service correctly filters products by criteria
- **Pre-conditions:** Products with different attributes exist in database
- **Test Steps:**
  1. Call `productService.filterProducts()` with FilterRequestDTO
  2. Verify price range filtering works correctly
  3. Verify brand filtering works correctly
  4. Verify gender filtering works correctly
- **Expected Result:** Filtered products matching all criteria returned
- **Test Type:** Positive
- **Code Example:**
```java
@Test
public void testFilterProducts_Success() {
    // Arrange
    FilterRequestDTO filterRequest = new FilterRequestDTO();
    filterRequest.setMinPrice(new BigDecimal("1000000"));
    filterRequest.setMaxPrice(new BigDecimal("3000000"));
    filterRequest.setBrands(Arrays.asList("Chanel", "Dior"));
    filterRequest.setSuitableGender("Unisex");

    Pageable pageable = PageRequest.of(0, 10);

    List<ProductCard> mockFilteredProducts = Arrays.asList(
        new ProductCard(1, "Chanel Bleu", "chanel-bleu.jpg", new BigDecimal("2500000"))
    );

    Page<ProductCard> mockPage = new PageImpl<>(mockFilteredProducts, pageable, 1);

    when(productRepository.findProductsWithFilters(
        filterRequest.getMinPrice(),
        filterRequest.getMaxPrice(),
        filterRequest.getBrands(),
        filterRequest.getSuitableGender(),
        pageable
    )).thenReturn(mockPage);

    // Act
    Page<ProductCard> result = productService.filterProducts(filterRequest, pageable);

    // Assert
    assertEquals(1, result.getContent().size());
    ProductCard product = result.getContent().get(0);
    assertTrue(product.getPrice().compareTo(filterRequest.getMinPrice()) >= 0);
    assertTrue(product.getPrice().compareTo(filterRequest.getMaxPrice()) <= 0);
}
```
- **Expected Response:**
```java
Page<ProductCard> result = {
    "content": [
        {
            "productId": 1,
            "productName": "Chanel Bleu",
            "imageUrl": "chanel-bleu.jpg",
            "price": 2500000.00,
            "brand": "Chanel",
            "suitableGender": "Unisex"
        }
    ],
    "totalElements": 1,
    "totalPages": 1
}
```

### UT_AUTH_05
- **Feature Under Test:** Password Encoding Validation
- **Test Objective:** Verify that passwords are properly encoded before storage
- **Pre-conditions:** BCrypt password encoder configured
- **Test Steps:**
  1. Create RegisterRequest with plain text password
  2. Call `customerService.register()` method
  3. Retrieve saved customer from database
  4. Verify password is encoded (not plain text)
  5. Verify encoded password can be matched with original
- **Expected Result:** Password stored as BCrypt hash, original password can be verified
- **Test Type:** Positive
- **Code Example:**
```java
@Test
public void testPasswordEncoding() {
    // Arrange
    RegisterRequest request = new RegisterRequest();
    request.setUsername("passwordtest");
    request.setPassword("plainPassword123");
    request.setName("Password Test");
    request.setEmail("password@test.com");
    request.setPhoneNumber("0123456789");

    // Act
    CustomerResponseDTO result = customerService.register(request);

    // Assert
    Customer savedCustomer = customerRepository.findByUsername("passwordtest").get();

    // Verify password is not stored as plain text
    assertNotEquals("plainPassword123", savedCustomer.getPassword());

    // Verify password starts with BCrypt prefix
    assertTrue(savedCustomer.getPassword().startsWith("$2a$") ||
               savedCustomer.getPassword().startsWith("$2b$"));

    // Verify password can be matched
    assertTrue(passwordEncoder.matches("plainPassword123", savedCustomer.getPassword()));

    // Verify wrong password doesn't match
    assertFalse(passwordEncoder.matches("wrongPassword", savedCustomer.getPassword()));
}
```
- **Expected Response:**
```java
// Encoded password format:
"$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo0yvQq0cv61Mr0EmP.B8NUODdeXdG"

// Password validation:
boolean correctMatch = true;   // for "plainPassword123"
boolean incorrectMatch = false; // for "wrongPassword"
```

### UT_CART_04
- **Feature Under Test:** Cart Total Calculation
- **Test Objective:** Verify that cart total is calculated correctly with multiple items
- **Pre-conditions:** Cart with multiple items exists
- **Test Steps:**
  1. Create cart with multiple different products
  2. Call `cartService.calculateCartTotal()` method
  3. Verify total equals sum of (quantity × unit price) for all items
  4. Add new item and verify total updates
  5. Remove item and verify total updates
- **Expected Result:** Cart total accurately reflects sum of all item subtotals
- **Test Type:** Positive
- **Code Example:**
```java
@Test
public void testCartTotalCalculation() {
    // Arrange
    Customer customer = createTestCustomer();
    Cart cart = new Cart();
    cart.setCustomer(customer);
    cart.setStatus("active");
    cart = cartRepository.save(cart);

    // Add multiple items
    CartItem item1 = createCartItem(cart, 1500000, 2); // 3,000,000
    CartItem item2 = createCartItem(cart, 2500000, 1); // 2,500,000
    CartItem item3 = createCartItem(cart, 1800000, 3); // 5,400,000

    cartItemRepository.saveAll(Arrays.asList(item1, item2, item3));

    // Act
    BigDecimal calculatedTotal = cartService.calculateCartTotal(cart);

    // Assert
    BigDecimal expectedTotal = new BigDecimal("10900000"); // 3M + 2.5M + 5.4M
    assertEquals(0, expectedTotal.compareTo(calculatedTotal));

    // Test adding new item
    CartItem item4 = createCartItem(cart, 3000000, 1); // 3,000,000
    cartItemRepository.save(item4);

    BigDecimal newTotal = cartService.calculateCartTotal(cart);
    BigDecimal expectedNewTotal = new BigDecimal("13900000");
    assertEquals(0, expectedNewTotal.compareTo(newTotal));

    // Test removing item
    cartItemRepository.delete(item1);
    BigDecimal finalTotal = cartService.calculateCartTotal(cart);
    BigDecimal expectedFinalTotal = new BigDecimal("10900000"); // 13.9M - 3M
    assertEquals(0, expectedFinalTotal.compareTo(finalTotal));
}
```
- **Expected Response:**
```java
// Cart total calculations:
BigDecimal initialTotal = 10900000.00;  // Sum of all items
BigDecimal afterAddition = 13900000.00; // After adding 3M item
BigDecimal afterRemoval = 10900000.00;  // After removing 3M item

// Cart object with updated total:
Cart cart = {
    "cartId": 1,
    "totalAmount": 10900000.00,
    "itemCount": 3
}
```

### UT_PRODUCT_03
- **Feature Under Test:** Product Filtering Logic
- **Test Objective:** Verify product filtering works correctly with multiple criteria
- **Pre-conditions:** Products with various attributes exist in database
- **Test Steps:**
  1. Create FilterRequestDTO with multiple criteria (price, brand, gender)
  2. Call `productService.filterProducts()` method
  3. Verify all returned products match ALL filter criteria
  4. Test edge cases (empty filters, no matches)
- **Expected Result:** Only products matching all criteria returned
- **Test Type:** Positive
- **Code Example:**
```java
@Test
public void testProductFilteringLogic() {
    // Arrange - Create test products
    Product product1 = createTestProduct("Chanel No.5", "Chanel", "Female", 2500000);
    Product product2 = createTestProduct("Dior Sauvage", "Dior", "Male", 2800000);
    Product product3 = createTestProduct("Tom Ford Unisex", "Tom Ford", "Unisex", 3200000);
    Product product4 = createTestProduct("Chanel Bleu", "Chanel", "Male", 2700000);

    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setMinPrice(new BigDecimal("2000000"));
    filter.setMaxPrice(new BigDecimal("3000000"));
    filter.setBrands(Arrays.asList("Chanel", "Dior"));
    filter.setSuitableGender("Male");

    Pageable pageable = PageRequest.of(0, 10);

    // Act
    Page<ProductCard> result = productService.filterProducts(filter, pageable);

    // Assert
    assertEquals(2, result.getContent().size()); // Dior Sauvage + Chanel Bleu

    for (ProductCard product : result.getContent()) {
        // Verify price range
        assertTrue(product.getPrice().compareTo(filter.getMinPrice()) >= 0);
        assertTrue(product.getPrice().compareTo(filter.getMaxPrice()) <= 0);

        // Verify brand
        assertTrue(filter.getBrands().contains(product.getBrand()));

        // Verify gender
        assertEquals("Male", product.getSuitableGender());
    }

    // Test empty filter (should return all products)
    FilterRequestDTO emptyFilter = new FilterRequestDTO();
    Page<ProductCard> allProducts = productService.filterProducts(emptyFilter, pageable);
    assertEquals(4, allProducts.getContent().size());

    // Test no matches
    FilterRequestDTO noMatchFilter = new FilterRequestDTO();
    noMatchFilter.setMinPrice(new BigDecimal("5000000")); // Too high
    Page<ProductCard> noMatches = productService.filterProducts(noMatchFilter, pageable);
    assertEquals(0, noMatches.getContent().size());
}
```
- **Expected Response:**
```java
// Filtered results:
Page<ProductCard> result = {
    "content": [
        {
            "productId": 2,
            "productName": "Dior Sauvage",
            "brand": "Dior",
            "price": 2800000.00,
            "suitableGender": "Male"
        },
        {
            "productId": 4,
            "productName": "Chanel Bleu",
            "brand": "Chanel",
            "price": 2700000.00,
            "suitableGender": "Male"
        }
    ],
    "totalElements": 2
}
```

---

## Integration Tests

### IT_AUTH_01
- **Feature Under Test:** User Registration API Integration
- **Test Objective:** Verify complete registration flow from API endpoint to database
- **Pre-conditions:** Application server running, database accessible
- **Test Steps:**
  1. Send POST request to `/api/v1/auth/register` with valid registration data
  2. Verify HTTP 200 response with success status
  3. Verify customer record created in database
  4. Verify wishlist record created for customer
- **Expected Result:** HTTP 200 with customer data and database records created
- **Test Type:** Positive
- **Code Example:**
```java
@Test
@Transactional
public void testRegisterCustomer_Integration() throws Exception {
    // Arrange
    String requestBody = """
        {
            "username": "integrationtest",
            "password": "password123",
            "name": "Integration Test User",
            "email": "integration@test.com",
            "phoneNumber": "0987654321"
        }
        """;

    // Act
    MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody))
            .andExpect(status().isOk())
            .andReturn();

    // Assert
    String responseContent = result.getResponse().getContentAsString();
    JsonNode jsonResponse = objectMapper.readTree(responseContent);

    assertEquals(200, jsonResponse.get("code").asInt());
    assertEquals("success", jsonResponse.get("status").asText());
    assertEquals("Đăng ký thành công", jsonResponse.get("message").asText());

    JsonNode data = jsonResponse.get("data");
    assertEquals("integrationtest", data.get("username").asText());
    assertEquals("Integration Test User", data.get("name").asText());
    assertEquals("integration@test.com", data.get("email").asText());

    // Verify database records
    Optional<Customer> customer = customerRepository.findByUsername("integrationtest");
    assertTrue(customer.isPresent());

    Optional<WishList> wishlist = wishListRepository.findByCustomer(customer.get());
    assertTrue(wishlist.isPresent());
}
```
- **Expected Response:**
```json
{
    "code": 200,
    "status": "success",
    "message": "Đăng ký thành công",
    "data": {
        "customerId": 1,
        "username": "integrationtest",
        "name": "Integration Test User",
        "email": "integration@test.com",
        "phoneNumber": "0987654321"
    }
}
```

### IT_AUTH_02
- **Feature Under Test:** User Login API Integration
- **Test Objective:** Verify complete login flow with JWT token generation
- **Pre-conditions:** Valid user exists in database
- **Test Steps:**
  1. Send POST request to `/api/v1/auth/login` with valid credentials
  2. Verify HTTP 200 response with JWT token
  3. Verify token contains correct user claims
  4. Verify token can be used for authenticated requests
- **Expected Result:** HTTP 200 with valid JWT token that can be used for authentication
- **Test Type:** Positive
- **Code Example:**
```java
@Test
@Transactional
public void testLoginCustomer_Integration() throws Exception {
    // Arrange - Create test user
    Customer testCustomer = new Customer();
    testCustomer.setUsername("logintest");
    testCustomer.setPassword(passwordEncoder.encode("password123"));
    testCustomer.setName("Login Test User");
    testCustomer.setEmail("login@test.com");
    testCustomer.setPhoneNumber("0123456789");
    customerRepository.save(testCustomer);

    String requestBody = """
        {
            "username": "logintest",
            "password": "password123"
        }
        """;

    // Act
    MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody))
            .andExpect(status().isOk())
            .andReturn();

    // Assert
    String responseContent = result.getResponse().getContentAsString();
    JsonNode jsonResponse = objectMapper.readTree(responseContent);

    assertEquals(200, jsonResponse.get("code").asInt());
    assertEquals("success", jsonResponse.get("status").asText());
    assertEquals("Đăng nhập thành công", jsonResponse.get("message").asText());

    String token = jsonResponse.get("data").asText();
    assertNotNull(token);
    assertTrue(jwtUtil.validateToken(token));
    assertEquals("logintest", jwtUtil.getUsernameFromToken(token));

    // Test token usage for authenticated request
    mockMvc.perform(get("/api/v1/customers/me")
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk());
}
```
- **Expected Response:**
```json
{
    "code": 200,
    "status": "success",
    "message": "Đăng nhập thành công",
    "data": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsb2dpbnRlc3QiLCJjdXN0b21lcklkIjoxLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3MDMyNTYwMDAsImV4cCI6MTcwMzM0MjQwMH0.signature"
}
```

### IT_CART_01
- **Feature Under Test:** Add to Cart API Integration
- **Test Objective:** Verify authenticated user can add products to cart via API
- **Pre-conditions:** User logged in, valid product variant exists
- **Test Steps:**
  1. Send POST request to `/api/v1/carts/add` with Authorization header
  2. Include valid AddToCartRequest in request body
  3. Verify HTTP 200 response
  4. Send GET request to `/api/v1/carts` to verify item added
- **Expected Result:** Product successfully added to cart, visible in cart items list
- **Test Type:** Positive
- **Code Example:**
```java
@Test
@Transactional
public void testAddToCart_Integration() throws Exception {
    // Arrange - Create test user and product
    Customer testCustomer = createTestCustomer("carttest", "password123");
    ProductVariant productVariant = createTestProductVariant(1500000, 10);
    String token = jwtUtil.generateToken(testCustomer.getCustomerId(), testCustomer.getUsername());

    String requestBody = """
        {
            "productVariantId": %d,
            "quantity": 2,
            "note": "Test note"
        }
        """.formatted(productVariant.getProductVariantId());

    // Act - Add to cart
    mockMvc.perform(post("/api/v1/carts/add")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(content().string("Đã thêm sản phẩm vào giỏ hàng."));

    // Assert - Verify cart contents
    MvcResult cartResult = mockMvc.perform(get("/api/v1/carts")
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andReturn();

    String cartResponse = cartResult.getResponse().getContentAsString();
    JsonNode cartItems = objectMapper.readTree(cartResponse);

    assertEquals(1, cartItems.size());
    assertEquals(productVariant.getProductVariantId(), cartItems.get(0).get("productVariantId").asInt());
    assertEquals(2, cartItems.get(0).get("quantity").asInt());
    assertEquals("Test note", cartItems.get(0).get("note").asText());
}
```
- **Expected Response:**
```json
// Add to cart response:
"Đã thêm sản phẩm vào giỏ hàng."

// Get cart response:
[
    {
        "cartItemId": 1,
        "productVariantId": 1,
        "productName": "Test Perfume",
        "volume": 100,
        "quantity": 2,
        "unitPrice": 1500000.00,
        "note": "Test note",
        "imageUrl": "test-perfume.jpg"
    }
]
```

### IT_CART_02
- **Feature Under Test:** Cart Operations with Authentication
- **Test Objective:** Verify cart operations require valid authentication
- **Pre-conditions:** Application server running
- **Test Steps:**
  1. Send POST request to `/api/v1/carts/add` without Authorization header
  2. Send GET request to `/api/v1/carts` with invalid token
  3. Send PUT request to `/api/v1/carts/update` with expired token
- **Expected Result:** HTTP 401 Unauthorized responses for all requests
- **Test Type:** Negative
- **Code Example:**
```java
@Test
public void testCartOperations_RequireAuthentication() throws Exception {
    String requestBody = """
        {
            "productVariantId": 1,
            "quantity": 2
        }
        """;

    // Test 1: No Authorization header
    mockMvc.perform(post("/api/v1/carts/add")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody))
            .andExpect(status().isUnauthorized());

    // Test 2: Invalid token
    mockMvc.perform(get("/api/v1/carts")
            .header("Authorization", "Bearer invalid.token.here"))
            .andExpect(status().isUnauthorized());

    // Test 3: Expired token
    String expiredToken = createExpiredToken();
    mockMvc.perform(put("/api/v1/carts/update")
            .header("Authorization", "Bearer " + expiredToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                    "cartItemId": 1,
                    "newQuantity": 3,
                    "productVariantId": 1
                }
                """))
            .andExpect(status().isUnauthorized());
}
```
- **Expected Response:**
```json
// All requests return:
{
    "timestamp": "2024-12-15T10:30:00.000+00:00",
    "status": 401,
    "error": "Unauthorized",
    "path": "/api/v1/carts/add"
}
```

### IT_PRODUCT_01
- **Feature Under Test:** Product Search API Integration
- **Test Objective:** Verify product search functionality across API and database
- **Pre-conditions:** Products exist in database with searchable names
- **Test Steps:**
  1. Send GET request to `/api/v1/products/search?keyword=perfume&page=0&size=10`
  2. Verify HTTP 200 response with paginated results
  3. Verify all returned products contain keyword in name
  4. Verify pagination metadata is correct
- **Expected Result:** HTTP 200 with paginated search results matching keyword
- **Test Type:** Positive
- **Code Example:**
```java
@Test
@Transactional
public void testProductSearch_Integration() throws Exception {
    // Arrange - Create test products
    createTestProduct("Chanel Perfume No.5", "Luxury perfume", 2500000);
    createTestProduct("Dior Perfume Sauvage", "Men's perfume", 2800000);
    createTestProduct("Tom Ford Cologne", "Premium cologne", 3200000);

    // Act
    MvcResult result = mockMvc.perform(get("/api/v1/products/search")
            .param("keyword", "perfume")
            .param("page", "0")
            .param("size", "10"))
            .andExpect(status().isOk())
            .andReturn();

    // Assert
    String responseContent = result.getResponse().getContentAsString();
    JsonNode jsonResponse = objectMapper.readTree(responseContent);

    assertEquals(200, jsonResponse.get("code").asInt());
    assertEquals("success", jsonResponse.get("status").asText());

    JsonNode data = jsonResponse.get("data");
    JsonNode content = data.get("content");

    assertEquals(2, content.size()); // Only products with "perfume" in name
    assertEquals(0, data.get("page").asInt());
    assertEquals(10, data.get("size").asInt());
    assertEquals(2, data.get("totalElements").asInt());

    // Verify all results contain keyword
    for (JsonNode product : content) {
        String productName = product.get("productName").asText().toLowerCase();
        assertTrue(productName.contains("perfume"));
    }
}
```
- **Expected Response:**
```json
{
    "code": 200,
    "status": "success",
    "message": "Lấy dữ liệu thành công",
    "data": {
        "content": [
            {
                "productId": 1,
                "productName": "Chanel Perfume No.5",
                "imageUrl": "chanel-perfume.jpg",
                "price": 2500000.00,
                "brand": "Chanel"
            },
            {
                "productId": 2,
                "productName": "Dior Perfume Sauvage",
                "imageUrl": "dior-perfume.jpg",
                "price": 2800000.00,
                "brand": "Dior"
            }
        ],
        "page": 0,
        "size": 10,
        "totalElements": 2,
        "totalPages": 1
    }
}
```

### IT_AUTH_03
- **Feature Under Test:** Authentication Error Handling Integration
- **Test Objective:** Verify API properly handles authentication errors
- **Pre-conditions:** Application server running
- **Test Steps:**
  1. Send POST request to `/api/v1/auth/login` with non-existent username
  2. Send POST request to `/api/v1/auth/login` with wrong password
  3. Send POST request to `/api/v1/auth/register` with existing username
- **Expected Result:** HTTP 400 with appropriate error messages
- **Test Type:** Negative
- **Code Example:**
```java
@Test
public void testAuthenticationErrors_Integration() throws Exception {
    // Test 1: Non-existent username
    String invalidUserRequest = """
        {
            "username": "nonexistent",
            "password": "password123"
        }
        """;

    MvcResult result1 = mockMvc.perform(post("/api/v1/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(invalidUserRequest))
            .andExpect(status().isBadRequest())
            .andReturn();

    JsonNode response1 = objectMapper.readTree(result1.getResponse().getContentAsString());
    assertEquals("Tên đăng nhập không tồn tại", response1.get("message").asText());

    // Test 2: Wrong password
    Customer testUser = createTestCustomer("wrongpasstest", "correctpassword");

    String wrongPasswordRequest = """
        {
            "username": "wrongpasstest",
            "password": "wrongpassword"
        }
        """;

    MvcResult result2 = mockMvc.perform(post("/api/v1/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(wrongPasswordRequest))
            .andExpect(status().isBadRequest())
            .andReturn();

    JsonNode response2 = objectMapper.readTree(result2.getResponse().getContentAsString());
    assertEquals("Mật khẩu không chính xác", response2.get("message").asText());
}
```
- **Expected Response:**
```json
// Non-existent username:
{
    "code": 400,
    "status": "error",
    "message": "Tên đăng nhập không tồn tại",
    "data": null
}

// Wrong password:
{
    "code": 400,
    "status": "error",
    "message": "Mật khẩu không chính xác",
    "data": null
}
```

---

## Functional Tests

### FT_AUTH_01
- **Feature Under Test:** Complete User Registration Workflow
- **Test Objective:** Verify end-to-end user registration from frontend to backend
- **Pre-conditions:** Application running, browser opened to homepage
- **Test Steps:**
  1. Navigate to homepage and click "Đăng nhập" in navbar
  2. Click "Đăng ký" tab in modal
  3. Fill registration form: name="Test User", email="test@example.com", username="testuser", password="password123", phone="0123456789"
  4. Click "Đăng ký" button
  5. Verify automatic login after registration
  6. Verify redirect to homepage with user logged in
- **Expected Result:** User successfully registered, automatically logged in, navbar shows user menu instead of login button
- **Test Type:** Positive
- **Code Example:**
```javascript
// Selenium WebDriver test
@Test
public void testCompleteRegistrationWorkflow() {
    // Navigate to homepage
    driver.get("http://localhost:3000");

    // Click login button in navbar
    WebElement loginButton = driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
    loginButton.click();

    // Wait for modal to appear and click register tab
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    WebElement registerTab = wait.until(ExpectedConditions.elementToBeClickable(
        By.xpath("//button[contains(text(), 'Đăng ký')]")));
    registerTab.click();

    // Fill registration form
    driver.findElement(By.name("name")).sendKeys("Test User");
    driver.findElement(By.name("email")).sendKeys("test@example.com");
    driver.findElement(By.name("username")).sendKeys("testuser");
    driver.findElement(By.name("password")).sendKeys("password123");
    driver.findElement(By.name("phoneNumber")).sendKeys("0123456789");

    // Submit registration
    WebElement submitButton = driver.findElement(By.xpath("//button[@type='submit'][contains(text(), 'Đăng ký')]"));
    submitButton.click();

    // Verify success toast appears
    WebElement successToast = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//div[contains(@class, 'toast')][contains(text(), 'Đăng nhập thành công')]")));
    assertTrue(successToast.isDisplayed());

    // Verify redirect to homepage and user menu appears
    wait.until(ExpectedConditions.urlToBe("http://localhost:3000/"));

    // Verify navbar shows user profile instead of login button
    WebElement userMenu = wait.until(ExpectedConditions.presenceOfElementLocated(
        By.xpath("//div[contains(@class, 'user-menu')]")));
    assertTrue(userMenu.isDisplayed());

    // Verify login button is no longer visible
    List<WebElement> loginButtons = driver.findElements(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
    assertEquals(0, loginButtons.size());
}
```
- **Expected Response:**
```javascript
// Frontend state after successful registration:
{
    user: {
        id: "1",
        username: "testuser",
        name: "Test User",
        email: "test@example.com"
    },
    isAuthenticated: true,
    token: "eyJhbGciOiJIUzUxMiJ9..."
}

// UI changes:
// - Login button replaced with user profile menu
// - Toast message: "Đăng nhập thành công!"
// - URL redirected to "/"
// - Modal closed automatically
```

### FT_AUTH_02
- **Feature Under Test:** User Login Workflow
- **Test Objective:** Verify complete login process from frontend interface
- **Pre-conditions:** Valid user account exists, user not logged in
- **Test Steps:**
  1. Navigate to homepage
  2. Click "Đăng nhập" in navbar
  3. Enter valid credentials in login form
  4. Click "Đăng nhập" button
  5. Verify success toast message appears
  6. Verify redirect to homepage after 1 second
  7. Verify navbar shows user profile menu
- **Expected Result:** User successfully logged in, redirected to homepage, UI updated to show authenticated state
- **Test Type:** Positive
- **Code Example:**
```javascript
@Test
public void testCompleteLoginWorkflow() {
    // Pre-condition: Create test user via API
    createTestUserViaAPI("loginuser", "password123", "Login User", "login@test.com");

    // Navigate to homepage
    driver.get("http://localhost:3000");

    // Click login button
    WebElement loginButton = driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
    loginButton.click();

    // Wait for modal and fill login form
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    WebElement usernameField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("username")));
    WebElement passwordField = driver.findElement(By.name("password"));

    usernameField.sendKeys("loginuser");
    passwordField.sendKeys("password123");

    // Submit login
    WebElement submitButton = driver.findElement(By.xpath("//button[@type='submit'][contains(text(), 'Đăng nhập')]"));
    submitButton.click();

    // Verify success toast
    WebElement successToast = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//div[contains(text(), 'Đăng nhập thành công')]")));
    assertTrue(successToast.isDisplayed());

    // Wait for redirect (1 second delay as per code)
    Thread.sleep(1500);

    // Verify URL and user menu
    assertEquals("http://localhost:3000/", driver.getCurrentUrl());
    WebElement userMenu = wait.until(ExpectedConditions.presenceOfElementLocated(
        By.xpath("//div[contains(@class, 'user-menu')]")));
    assertTrue(userMenu.isDisplayed());

    // Verify modal is closed
    List<WebElement> modals = driver.findElements(By.xpath("//div[contains(@class, 'modal')]"));
    assertEquals(0, modals.size());
}
```
- **Expected Response:**
```javascript
// API Response from login:
{
    "code": 200,
    "status": "success",
    "message": "Đăng nhập thành công",
    "data": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsb2dpbnVzZXIi..."
}

// Frontend state after login:
{
    user: {
        id: "1",
        username: "loginuser",
        role: "customer"
    },
    isAuthenticated: true
}

// UI changes:
// - Success toast displayed for 3 seconds
// - Modal closes automatically
// - Navbar updates to show user profile
// - Page redirects to "/" after 1 second
```

### FT_CART_01
- **Feature Under Test:** Complete Shopping Cart Workflow
- **Test Objective:** Verify end-to-end cart functionality from product selection to checkout
- **Pre-conditions:** User logged in, products available
- **Test Steps:**
  1. Navigate to product listing page
  2. Click on a product to view details
  3. Select product variant and quantity
  4. Click "Thêm vào giỏ hàng" button
  5. Navigate to cart page via navbar cart icon
  6. Verify product appears in cart with correct details
  7. Update quantity using +/- buttons
  8. Verify cart total updates automatically
  9. Click "Tiếp tục" to proceed to checkout
- **Expected Result:** Product added to cart, quantity updates work, cart total calculates correctly, checkout page accessible
- **Test Type:** Positive
- **Code Example:**
```javascript
@Test
public void testCompleteCartWorkflow() {
    // Pre-condition: Login user
    loginTestUser("cartuser", "password123");

    // Navigate to product listing
    driver.get("http://localhost:3000/products");

    // Click on first product
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    WebElement firstProduct = wait.until(ExpectedConditions.elementToBeClickable(
        By.xpath("//div[contains(@class, 'product-card')][1]")));
    firstProduct.click();

    // Wait for product detail page
    wait.until(ExpectedConditions.urlContains("/products/"));

    // Select product variant (50ml)
    WebElement variantSelect = driver.findElement(By.name("productVariant"));
    Select select = new Select(variantSelect);
    select.selectByVisibleText("50ml");

    // Set quantity to 2
    WebElement quantityInput = driver.findElement(By.name("quantity"));
    quantityInput.clear();
    quantityInput.sendKeys("2");

    // Add to cart
    WebElement addToCartButton = driver.findElement(By.xpath("//button[contains(text(), 'Thêm vào giỏ hàng')]"));
    addToCartButton.click();

    // Verify success message
    WebElement successMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//div[contains(text(), 'Đã thêm sản phẩm vào giỏ hàng')]")));
    assertTrue(successMessage.isDisplayed());

    // Navigate to cart via navbar icon
    WebElement cartIcon = driver.findElement(By.xpath("//a[@href='/cart']"));
    cartIcon.click();

    // Verify cart page loaded
    wait.until(ExpectedConditions.urlToBe("http://localhost:3000/cart"));

    // Verify product in cart
    WebElement cartItem = wait.until(ExpectedConditions.presenceOfElementLocated(
        By.xpath("//div[contains(@class, 'cart-item')]")));
    assertTrue(cartItem.isDisplayed());

    // Verify quantity is 2
    WebElement quantityDisplay = driver.findElement(By.xpath("//span[contains(@class, 'quantity')]"));
    assertEquals("2", quantityDisplay.getText());

    // Update quantity using + button
    WebElement plusButton = driver.findElement(By.xpath("//button[contains(@class, 'quantity-plus')]"));
    plusButton.click();

    // Wait for quantity update
    wait.until(ExpectedConditions.textToBe(By.xpath("//span[contains(@class, 'quantity')]"), "3"));

    // Verify cart total updated
    WebElement cartTotal = driver.findElement(By.xpath("//div[contains(@class, 'cart-total')]"));
    String totalText = cartTotal.getText();
    assertTrue(totalText.contains("4.500.000")); // 3 * 1.500.000

    // Proceed to checkout
    WebElement checkoutButton = driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
    checkoutButton.click();

    // Verify checkout page
    wait.until(ExpectedConditions.urlToBe("http://localhost:3000/checkout"));
}
```
- **Expected Response:**
```javascript
// Add to cart API response:
"Đã thêm sản phẩm vào giỏ hàng."

// Cart state after operations:
{
    cartItems: [
        {
            cartItemId: 1,
            productName: "Chanel No.5",
            volume: 50,
            quantity: 3,
            unitPrice: 1500000.00,
            imageUrl: "chanel-no5.jpg"
        }
    ],
    cartTotal: 4500000.00
}

// UI updates:
// - Success toast after adding to cart
// - Cart icon shows item count badge
// - Cart page displays item with correct details
// - Quantity updates in real-time
// - Total recalculates automatically
// - Checkout button navigates to /checkout
```

### FT_PRODUCT_01
- **Feature Under Test:** Product Search and Browsing Workflow
- **Test Objective:** Verify complete product discovery experience
- **Pre-conditions:** Products exist in database, application running
- **Test Steps:**
  1. Navigate to homepage
  2. Use search bar to search for "nước hoa"
  3. Verify search results page displays matching products
  4. Apply filters using sidebar (brand, price range, gender)
  5. Verify filtered results update accordingly
  6. Click on a product card to view details
  7. Verify product detail page shows complete information
  8. Use breadcrumb navigation to return to search results
- **Expected Result:** Search returns relevant products, filters work correctly, product details accessible, navigation functions properly
- **Test Type:** Positive
- **Code Example:**
```javascript
@Test
public void testCompleteProductSearchWorkflow() {
    // Navigate to homepage
    driver.get("http://localhost:3000");

    // Use search bar
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    WebElement searchInput = wait.until(ExpectedConditions.presenceOfElementLocated(
        By.xpath("//input[@placeholder='Tìm kiếm sản phẩm...']")));
    searchInput.sendKeys("nước hoa");

    // Submit search
    WebElement searchButton = driver.findElement(By.xpath("//button[@type='submit']"));
    searchButton.click();

    // Verify search results page
    wait.until(ExpectedConditions.urlContains("/search"));

    // Verify search results displayed
    List<WebElement> productCards = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
        By.xpath("//div[contains(@class, 'product-card')]")));
    assertTrue(productCards.size() > 0);

    // Apply brand filter
    WebElement brandFilter = driver.findElement(By.xpath("//input[@value='Chanel']"));
    brandFilter.click();

    // Wait for filtered results
    Thread.sleep(1000); // Wait for filter to apply

    // Verify filtered results
    List<WebElement> filteredProducts = driver.findElements(By.xpath("//div[contains(@class, 'product-card')]"));
    assertTrue(filteredProducts.size() <= productCards.size());

    // Apply price range filter
    WebElement minPriceInput = driver.findElement(By.name("minPrice"));
    WebElement maxPriceInput = driver.findElement(By.name("maxPrice"));
    minPriceInput.clear();
    minPriceInput.sendKeys("1000000");
    maxPriceInput.clear();
    maxPriceInput.sendKeys("3000000");

    WebElement applyFilterButton = driver.findElement(By.xpath("//button[contains(text(), 'Áp dụng')]"));
    applyFilterButton.click();

    // Wait for price filter to apply
    Thread.sleep(1000);

    // Click on first product to view details
    WebElement firstProduct = driver.findElement(By.xpath("//div[contains(@class, 'product-card')][1]"));
    firstProduct.click();

    // Verify product detail page
    wait.until(ExpectedConditions.urlContains("/products/"));

    // Verify product information displayed
    WebElement productName = wait.until(ExpectedConditions.presenceOfElementLocated(
        By.xpath("//h1[contains(@class, 'product-name')]")));
    assertTrue(productName.isDisplayed());

    WebElement productPrice = driver.findElement(By.xpath("//span[contains(@class, 'product-price')]"));
    assertTrue(productPrice.isDisplayed());

    WebElement productDescription = driver.findElement(By.xpath("//div[contains(@class, 'product-description')]"));
    assertTrue(productDescription.isDisplayed());

    // Use breadcrumb to return to search
    WebElement breadcrumb = driver.findElement(By.xpath("//nav[contains(@class, 'breadcrumb')]//a[contains(text(), 'Tìm kiếm')]"));
    breadcrumb.click();

    // Verify back to search results
    wait.until(ExpectedConditions.urlContains("/search"));
}
```
- **Expected Response:**
```javascript
// Search API response:
{
    "code": 200,
    "status": "success",
    "message": "Lấy dữ liệu thành công",
    "data": {
        "content": [
            {
                "productId": 1,
                "productName": "Chanel No.5 Nước Hoa",
                "imageUrl": "chanel-no5.jpg",
                "price": 2500000.00,
                "brand": "Chanel"
            },
            {
                "productId": 2,
                "productName": "Dior Sauvage Nước Hoa Nam",
                "imageUrl": "dior-sauvage.jpg",
                "price": 2800000.00,
                "brand": "Dior"
            }
        ],
        "totalElements": 15,
        "totalPages": 2
    }
}

// Filter API response:
{
    "code": 200,
    "status": "success",
    "data": {
        "content": [
            {
                "productId": 1,
                "productName": "Chanel No.5 Nước Hoa",
                "price": 2500000.00,
                "brand": "Chanel"
            }
        ],
        "totalElements": 1
    }
}

// UI behavior:
// - Search results load with pagination
// - Filters apply in real-time
// - Product cards show key information
// - Product detail page shows complete info
// - Breadcrumb navigation works correctly
```

### FT_AUTH_03
- **Feature Under Test:** Authentication Error Handling
- **Test Objective:** Verify proper error handling for invalid login attempts
- **Pre-conditions:** Application running, invalid credentials prepared
- **Test Steps:**
  1. Navigate to login modal
  2. Enter non-existent username and any password
  3. Click "Đăng nhập" button
  4. Verify error message displays: "Tên đăng nhập không tồn tại"
  5. Enter valid username but wrong password
  6. Click "Đăng nhập" button
  7. Verify error message displays: "Mật khẩu không chính xác"
  8. Leave fields empty and click "Đăng nhập"
  9. Verify validation error messages appear
- **Expected Result:** Appropriate error messages displayed for each invalid scenario, form validation prevents empty submissions
- **Test Type:** Negative
- **Code Example:**
```javascript
@Test
public void testAuthenticationErrorHandling() {
    // Navigate to homepage and open login modal
    driver.get("http://localhost:3000");
    WebElement loginButton = driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
    loginButton.click();

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    // Test 1: Non-existent username
    WebElement usernameField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("username")));
    WebElement passwordField = driver.findElement(By.name("password"));
    WebElement submitButton = driver.findElement(By.xpath("//button[@type='submit']"));

    usernameField.sendKeys("nonexistentuser");
    passwordField.sendKeys("anypassword");
    submitButton.click();

    WebElement errorMessage1 = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//div[contains(@class, 'error')][contains(text(), 'Tên đăng nhập không tồn tại')]")));
    assertTrue(errorMessage1.isDisplayed());

    // Clear fields for next test
    usernameField.clear();
    passwordField.clear();

    // Test 2: Valid username, wrong password
    // Pre-condition: Create test user
    createTestUserViaAPI("validuser", "correctpassword", "Valid User", "valid@test.com");

    usernameField.sendKeys("validuser");
    passwordField.sendKeys("wrongpassword");
    submitButton.click();

    WebElement errorMessage2 = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//div[contains(@class, 'error')][contains(text(), 'Mật khẩu không chính xác')]")));
    assertTrue(errorMessage2.isDisplayed());

    // Test 3: Empty fields validation
    usernameField.clear();
    passwordField.clear();
    submitButton.click();

    WebElement usernameValidation = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//div[contains(@class, 'validation-error')][contains(text(), 'Username không được để trống')]")));
    WebElement passwordValidation = driver.findElement(
        By.xpath("//div[contains(@class, 'validation-error')][contains(text(), 'Password không được để trống')]"));

    assertTrue(usernameValidation.isDisplayed());
    assertTrue(passwordValidation.isDisplayed());
}
```
- **Expected Response:**
```javascript
// API error responses:
{
    "code": 400,
    "status": "error",
    "message": "Tên đăng nhập không tồn tại",
    "data": null
}

{
    "code": 400,
    "status": "error",
    "message": "Mật khẩu không chính xác",
    "data": null
}

// Frontend validation errors:
{
    username: "Username không được để trống",
    password: "Password không được để trống"
}

// UI behavior:
// - Error messages display in red
// - Form remains open for correction
// - No redirect occurs on error
// - Previous error clears when new attempt made
```

### FT_CART_02
- **Feature Under Test:** Cart Quantity Validation
- **Test Objective:** Verify cart enforces quantity limits and validation
- **Pre-conditions:** User logged in, product in cart
- **Test Steps:**
  1. Navigate to cart page
  2. Attempt to increase quantity above 10 using + button
  3. Verify error toast appears: "Số lượng không hợp lệ"
  4. Attempt to decrease quantity below 1
  5. Verify quantity remains at 1
  6. Manually enter invalid quantity (0 or negative)
  7. Verify validation prevents invalid values
- **Expected Result:** Quantity limits enforced, error messages displayed, invalid inputs prevented
- **Test Type:** Negative
- **Code Example:**
```javascript
@Test
public void testCartQuantityValidation() {
    // Pre-condition: Login and add product to cart
    loginTestUser("cartvalidationuser", "password123");
    addProductToCartViaAPI(1, 5); // Add product with quantity 5

    // Navigate to cart page
    driver.get("http://localhost:3000/cart");

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    // Test 1: Increase quantity above 10
    WebElement quantityDisplay = wait.until(ExpectedConditions.presenceOfElementLocated(
        By.xpath("//span[contains(@class, 'quantity-value')]")));
    assertEquals("5", quantityDisplay.getText());

    // Click + button 6 times to reach 11
    WebElement plusButton = driver.findElement(By.xpath("//button[contains(@class, 'quantity-plus')]"));
    for (int i = 0; i < 6; i++) {
        plusButton.click();
        Thread.sleep(500); // Wait for each update
    }

    // Verify error toast appears
    WebElement errorToast = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//div[contains(@class, 'toast-error')][contains(text(), 'Số lượng không hợp lệ')]")));
    assertTrue(errorToast.isDisplayed());

    // Verify quantity remains at 10 (max limit)
    wait.until(ExpectedConditions.textToBe(By.xpath("//span[contains(@class, 'quantity-value')]"), "10"));

    // Test 2: Decrease quantity below 1
    WebElement minusButton = driver.findElement(By.xpath("//button[contains(@class, 'quantity-minus')]"));

    // Click - button 10 times to try to go below 1
    for (int i = 0; i < 10; i++) {
        minusButton.click();
        Thread.sleep(500);
    }

    // Verify quantity remains at 1 (min limit)
    WebElement finalQuantity = driver.findElement(By.xpath("//span[contains(@class, 'quantity-value')]"));
    assertEquals("1", finalQuantity.getText());

    // Test 3: Manual invalid input
    WebElement quantityInput = driver.findElement(By.xpath("//input[contains(@class, 'quantity-input')]"));
    quantityInput.clear();
    quantityInput.sendKeys("0");
    quantityInput.sendKeys(Keys.ENTER);

    // Verify validation prevents 0
    WebElement validationError = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//div[contains(@class, 'validation-error')][contains(text(), 'Quantity must be at least 1')]")));
    assertTrue(validationError.isDisplayed());

    // Verify quantity reverts to previous valid value
    wait.until(ExpectedConditions.attributeToBe(quantityInput, "value", "1"));
}
```
- **Expected Response:**
```javascript
// API error response for invalid quantity:
{
    "error": "Số lượng không hợp lệ",
    "validRange": {
        "min": 1,
        "max": 10
    }
}

// Frontend validation:
{
    quantityLimits: {
        min: 1,
        max: 10,
        current: 10
    },
    errorMessage: "Số lượng không hợp lệ"
}

// UI behavior:
// - Plus button disabled when quantity = 10
// - Minus button disabled when quantity = 1
// - Error toast appears for invalid operations
// - Input field validates on blur/enter
// - Invalid values revert to last valid value
```

### FT_WISHLIST_01
- **Feature Under Test:** Wishlist Management Workflow
- **Test Objective:** Verify complete wishlist functionality from adding items to moving to cart
- **Pre-conditions:** User logged in, products available
- **Test Steps:**
  1. Navigate to product detail page
  2. Click "Yêu thích" button to add to wishlist
  3. Verify success message appears
  4. Navigate to wishlist page via navbar
  5. Verify product appears in wishlist
  6. Click "Move all to cart" button
  7. Verify items moved to cart
  8. Navigate to cart to confirm items present
- **Expected Result:** Products can be added to wishlist, viewed in wishlist page, and moved to cart successfully
- **Test Type:** Positive
- **Code Example:**
```javascript
@Test
public void testCompleteWishlistWorkflow() {
    // Pre-condition: Login user
    loginTestUser("wishlistuser", "password123");

    // Navigate to product detail page
    driver.get("http://localhost:3000/products/1");

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    // Add to wishlist
    WebElement wishlistButton = wait.until(ExpectedConditions.elementToBeClickable(
        By.xpath("//button[contains(text(), 'Yêu thích')]")));
    wishlistButton.click();

    // Verify success message
    WebElement successMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//div[contains(text(), 'Added to wishlist')]")));
    assertTrue(successMessage.isDisplayed());

    // Navigate to wishlist page
    WebElement wishlistLink = driver.findElement(By.xpath("//a[@href='/wishlist']"));
    wishlistLink.click();

    // Verify wishlist page loaded
    wait.until(ExpectedConditions.urlToBe("http://localhost:3000/wishlist"));

    // Verify product in wishlist
    WebElement wishlistItem = wait.until(ExpectedConditions.presenceOfElementLocated(
        By.xpath("//div[contains(@class, 'wishlist-item')]")));
    assertTrue(wishlistItem.isDisplayed());

    // Move all to cart
    WebElement moveToCartButton = driver.findElement(By.xpath("//button[contains(text(), 'Move all to cart')]"));
    moveToCartButton.click();

    // Verify success message
    WebElement moveSuccessMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//div[contains(text(), 'Moved all items from wishlist to cart')]")));
    assertTrue(moveSuccessMessage.isDisplayed());

    // Navigate to cart to verify
    WebElement cartLink = driver.findElement(By.xpath("//a[@href='/cart']"));
    cartLink.click();

    // Verify items in cart
    wait.until(ExpectedConditions.urlToBe("http://localhost:3000/cart"));
    WebElement cartItem = wait.until(ExpectedConditions.presenceOfElementLocated(
        By.xpath("//div[contains(@class, 'cart-item')]")));
    assertTrue(cartItem.isDisplayed());

    // Verify wishlist is now empty
    driver.navigate().to("http://localhost:3000/wishlist");
    List<WebElement> wishlistItems = driver.findElements(By.xpath("//div[contains(@class, 'wishlist-item')]"));
    assertEquals(0, wishlistItems.size());
}
```
- **Expected Response:**
```javascript
// Add to wishlist API response:
"Added to wishlist"

// Get wishlist API response:
[
    {
        "wishlistItemId": 1,
        "productVariantId": 1,
        "productName": "Chanel No.5",
        "volume": 50,
        "price": 1500000.00,
        "imageUrl": "chanel-no5.jpg"
    }
]

// Move to cart API response:
"Moved all items from wishlist to cart"

// UI behavior:
// - Heart icon changes to filled when added to wishlist
// - Wishlist page shows all saved items
// - Move to cart transfers all items at once
// - Cart reflects new items from wishlist
// - Wishlist becomes empty after move operation
```
