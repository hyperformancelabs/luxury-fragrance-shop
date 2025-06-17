import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

public class WishListServiceUnitTest {

    private Customer testCustomer;
    private WishList testWishList;
    private ProductVariant testProductVariant;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup test customer
        testCustomer = new Customer();
        testCustomer.setCustomerId(1);
        testCustomer.setUsername("testuser");

        // Setup test wishlist
        testWishList = new WishList();
        testWishList.setWishlistId(1);
        testWishList.setCustomer(testCustomer);

        // Setup test product variant
        testProductVariant = new ProductVariant();
        testProductVariant.setProductVariantId(1);
        testProductVariant.setPrice(new BigDecimal("99.99"));
        testProductVariant.setQuantityInStock(10);
        testWishList.setProductVariant(testProductVariant);
    }

    @Test
    void testGetAllWishlist() {
        // Arrange
        String token = "test-token";
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("testuser");
        when(customerRepository.findByUsername("testuser")).thenReturn(Optional.of(testCustomer));
        when(wishlistRepository.findByCustomer(testCustomer)).thenReturn(List.of(testWishList));

        // Act
        List<WishListItemResponse> result = wishListService.getAllWishlist(token);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void testAddToWishlist() {
        // Arrange
        when(productVariantRepository.findById(any())).thenReturn(Optional.of(testProductVariant));
        when(wishlistRepository.existsByCustomerAndProductVariant(testCustomer, testProductVariant)).thenReturn(false);

        AddToWishListRequest request = new AddToWishListRequest();
        request.setProductVariantId(1);

        // Act
        wishListService.addToWishlist(testCustomer, request);

        // Assert
        verify(wishlistRepository, times(1)).save(any());
    }

    @Test
    void testMoveAllToCart() {
        // Arrange
        String token = "test-token";
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("testuser");
        when(customerRepository.findByUsername("testuser")).thenReturn(Optional.of(testCustomer));
        when(wishlistRepository.findByCustomer(testCustomer)).thenReturn(List.of(testWishList));
        when(cartRepository.findByCustomerAndStatus(testCustomer, "active")).thenReturn(Optional.of(new Cart()));

        // Act
        wishListService.moveAllToCart(token);

        // Assert
        verify(cartItemRepository, atLeast(0)).save(any());
        verify(wishlistRepository, times(1)).deleteAll(any());
    }

    @Test
    void testRemoveFromWishlist() {
        // Arrange
        String token = "test-token";
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("testuser");
        when(customerRepository.findByUsername("testuser")).thenReturn(Optional.of(testCustomer));
        when(productVariantRepository.findById(any())).thenReturn(Optional.of(testProductVariant));
        when(wishlistRepository.findByCustomerAndProductVariant(testCustomer, testProductVariant)).thenReturn(Optional.of(testWishList));

        // Act
        wishListService.removeFromWishlist(token, 1);

        // Assert
        verify(wishlistRepository, times(1)).delete(any());
    }

    @Test
    void testClearWishlist() {
        // Arrange
        String token = "test-token";
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("testuser");
        when(customerRepository.findByUsername("testuser")).thenReturn(Optional.of(testCustomer));
        when(wishlistRepository.findByCustomer(testCustomer)).thenReturn(List.of(testWishList));

        // Act
        wishListService.clearWishlist(token);

        // Assert
        verify(wishlistRepository, times(1)).deleteAll(any());
    }
} 