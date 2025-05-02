document.addEventListener('DOMContentLoaded', function() {
    // Tạo HTML cho QuickView
    const quickviewHTML = `
        <div id="quickview-overlay" class="quickview-overlay">
            <div class="quickview-container">
                <button id="quickview-close" class="quickview-close">&times;</button>
                <div class="quickview-content">
                    <div class="quickview-images">
                        <img id="quickview-main-image" class="quickview-main-image" src="" alt="Product Image">
                        <div id="quickview-thumbnails" class="quickview-thumbnails">
                            <!-- Thumbnails will be added dynamically -->
                        </div>
                    </div>
                    <div class="quickview-details">
                        <div class="quickview-brand" id="quickview-brand"></div>
                        <h2 class="quickview-title" id="quickview-title"></h2>
                        <div class="quickview-rating">
                            <div class="quickview-stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                            <span id="quickview-rating-text">4.5 (125 đánh giá)</span>
                        </div>
                        <div class="quickview-price">
                            <span class="quickview-original-price" id="quickview-original-price"></span>
                            <span class="quickview-sale-price" id="quickview-sale-price"></span>
                        </div>
                        <div class="quickview-description" id="quickview-description"></div>
                        <div class="quickview-sizes">
                            <label class="quickview-size-label">Dung tích:</label>
                            <div class="quickview-size-options" id="quickview-size-options">
                                <!-- Size options will be added dynamically -->
                            </div>
                        </div>
                        <div class="quickview-quantity">
                            <label class="quickview-quantity-label">Số lượng:</label>
                            <div class="quickview-quantity-selector">
                                <button class="quickview-quantity-btn quickview-quantity-decrease">-</button>
                                <input type="number" id="quickview-quantity" class="quickview-quantity-input" value="1" min="1">
                                <button class="quickview-quantity-btn quickview-quantity-increase">+</button>
                            </div>
                        </div>
                        <div class="quickview-actions">
                            <button id="quickview-add-to-cart" class="quickview-add-to-cart">
                                <i class="fas fa-shopping-cart me-2"></i>Thêm vào giỏ hàng
                            </button>
                            <button id="quickview-wishlist" class="quickview-wishlist">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                        <div class="quickview-meta">
                            <div class="quickview-meta-item">
                                <span>Danh mục:</span> <span id="quickview-category"></span>
                            </div>
                            <div class="quickview-meta-item">
                                <span>Thương hiệu:</span> <span id="quickview-brand-meta"></span>
                            </div>
                            <div class="quickview-meta-item">
                                <span>Mã sản phẩm:</span> <span id="quickview-sku"></span>
                            </div>
                        </div>
                        <a id="quickview-view-details" class="btn btn-link ps-0">Xem chi tiết sản phẩm</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Thêm QuickView vào body
    const quickviewDiv = document.createElement('div');
    quickviewDiv.innerHTML = quickviewHTML;
    document.body.appendChild(quickviewDiv);

    // Lấy các phần tử DOM
    const quickviewOverlay = document.getElementById('quickview-overlay');
    const quickviewClose = document.getElementById('quickview-close');
    const quickviewMainImage = document.getElementById('quickview-main-image');
    const quickviewThumbnails = document.getElementById('quickview-thumbnails');
    const quickviewBrand = document.getElementById('quickview-brand');
    const quickviewTitle = document.getElementById('quickview-title');
    const quickviewRatingText = document.getElementById('quickview-rating-text');
    const quickviewOriginalPrice = document.getElementById('quickview-original-price');
    const quickviewSalePrice = document.getElementById('quickview-sale-price');
    const quickviewDescription = document.getElementById('quickview-description');
    const quickviewSizeOptions = document.getElementById('quickview-size-options');
    const quickviewQuantity = document.getElementById('quickview-quantity');
    const quickviewQuantityDecrease = document.querySelector('.quickview-quantity-decrease');
    const quickviewQuantityIncrease = document.querySelector('.quickview-quantity-increase');
    const quickviewAddToCart = document.getElementById('quickview-add-to-cart');
    const quickviewWishlist = document.getElementById('quickview-wishlist');
    const quickviewCategory = document.getElementById('quickview-category');
    const quickviewBrandMeta = document.getElementById('quickview-brand-meta');
    const quickviewSku = document.getElementById('quickview-sku');
    const quickviewViewDetails = document.getElementById('quickview-view-details');

    // Đóng QuickView khi nhấp vào nút đóng hoặc bên ngoài
    quickviewClose.addEventListener('click', closeQuickView);
    quickviewOverlay.addEventListener('click', function(e) {
        if (e.target === quickviewOverlay) {
            closeQuickView();
        }
    });

    // Đóng QuickView khi nhấn ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && quickviewOverlay.style.display === 'flex') {
            closeQuickView();
        }
    });

    // Xử lý số lượng
    quickviewQuantityDecrease.addEventListener('click', function() {
        const currentValue = parseInt(quickviewQuantity.value);
        if (currentValue > 1) {
            quickviewQuantity.value = currentValue - 1;
        }
    });

    quickviewQuantityIncrease.addEventListener('click', function() {
        const currentValue = parseInt(quickviewQuantity.value);
        quickviewQuantity.value = currentValue + 1;
    });

    // Xử lý thêm vào giỏ hàng
    quickviewAddToCart.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        const quantity = parseInt(quickviewQuantity.value);
        const selectedSize = document.querySelector('.quickview-size.active');

        if (!selectedSize) {
            alert('Vui lòng chọn dung tích sản phẩm');
            return;
        }

        const size = selectedSize.getAttribute('data-value');

        // Trong thực tế, bạn sẽ gửi yêu cầu AJAX để thêm sản phẩm vào giỏ hàng
        console.log('Thêm vào giỏ hàng:', {
            productId,
            quantity,
            size
        });

        // Hiển thị thông báo thành công
        alert('Đã thêm sản phẩm vào giỏ hàng!');

        // Đóng QuickView
        closeQuickView();
    });

    // Xử lý thêm vào yêu thích
    quickviewWishlist.addEventListener('click', function() {
        const productId = quickviewAddToCart.getAttribute('data-product-id');

        // Trong thực tế, bạn sẽ gửi yêu cầu AJAX để thêm sản phẩm vào danh sách yêu thích
        console.log('Thêm vào yêu thích:', {
            productId
        });

        // Thay đổi icon
        const wishlistIcon = this.querySelector('i');
        if (wishlistIcon.classList.contains('far')) {
            wishlistIcon.classList.remove('far');
            wishlistIcon.classList.add('fas');
            alert('Đã thêm sản phẩm vào danh sách yêu thích!');
        } else {
            wishlistIcon.classList.remove('fas');
            wishlistIcon.classList.add('far');
            alert('Đã xóa sản phẩm khỏi danh sách yêu thích!');
        }
    });

    // Hàm mở QuickView
    function openQuickView(productId) {
        console.log('openQuickView called with productId:', productId);

        // Trong thực tế, bạn sẽ gửi yêu cầu AJAX để lấy thông tin sản phẩm
        // Ở đây, chúng ta sẽ giả lập dữ liệu
        fetchProductData(productId).then(product => {
            // Cập nhật thông tin sản phẩm
            updateQuickViewContent(product);

            // Hiển thị QuickView
            quickviewOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Ngăn cuộn trang
        }).catch(error => {
            console.error('Error in openQuickView:', error);
        });
    }

    // Hàm đóng QuickView
    function closeQuickView() {
        quickviewOverlay.style.display = 'none';
        document.body.style.overflow = ''; // Cho phép cuộn trang
    }

    // Hàm giả lập lấy dữ liệu sản phẩm
    function fetchProductData(productId) {
        // Trong thực tế, bạn sẽ gửi yêu cầu AJAX đến server
        return new Promise(resolve => {
            setTimeout(() => {
                // Dữ liệu mẫu
                const product = {
                    id: productId,
                    name: 'Nước Hoa Nữ Versace Bright Crystal EDT',
                    brand: 'Versace',
                    category: 'Nước hoa nữ',
                    sku: 'VER-BC-' + productId,
                    description: 'Bright Crystal là một hương thơm tươi mát và quyến rũ, được lấy cảm hứng từ sự kết hợp yêu thích của Donatella Versace. Hương thơm mở đầu với sự tươi mát của quả lựu và yuzu, sau đó chuyển sang nốt hương giữa của hoa mẫu đơn, hoa mộc lan và hoa sen, cuối cùng là nốt hương cuối của xạ hương, gỗ mahogany và hổ phách.',
                    rating: 4.5,
                    reviewCount: 125,
                    originalPrice: 3500000,
                    salePrice: 2400000,
                    images: [
                        '/images/products/versace-bright-crystal.jpg',
                        '/images/products/versace-bright-crystal.jpg',
                        '/images/products/versace-bright-crystal.jpg'
                    ],
                    sizes: [
                        { value: '30ml', label: '30ml', price: 1200000 },
                        { value: '50ml', label: '50ml', price: 2400000 },
                        { value: '100ml', label: '100ml', price: 3200000 }
                    ]
                };

                resolve(product);
            }, 300);
        });
    }

    // Hàm cập nhật nội dung QuickView
    function updateQuickViewContent(product) {
        // Cập nhật hình ảnh
        quickviewMainImage.src = product.images[0] || '/images/placeholder.jpg';
        quickviewThumbnails.innerHTML = '';
        product.images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.alt = 'Thumbnail';
            thumbnail.className = index === 0 ? 'quickview-thumbnail active' : 'quickview-thumbnail';
            thumbnail.addEventListener('click', function() {
                quickviewMainImage.src = image;
                document.querySelectorAll('.quickview-thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                this.classList.add('active');
            });
            quickviewThumbnails.appendChild(thumbnail);
        });

        // Cập nhật thông tin sản phẩm
        quickviewBrand.textContent = product.brand;
        quickviewTitle.textContent = product.name;
        quickviewRatingText.textContent = `${product.rating} (${product.reviewCount} đánh giá)`;
        quickviewOriginalPrice.textContent = formatPrice(product.originalPrice);
        quickviewSalePrice.textContent = formatPrice(product.salePrice);
        quickviewDescription.textContent = product.description;

        // Cập nhật kích thước
        quickviewSizeOptions.innerHTML = '';
        product.sizes.forEach((size, index) => {
            const sizeOption = document.createElement('div');
            sizeOption.className = index === 0 ? 'quickview-size active' : 'quickview-size';
            sizeOption.textContent = size.label;
            sizeOption.setAttribute('data-value', size.value);
            sizeOption.setAttribute('data-price', size.price);
            sizeOption.addEventListener('click', function() {
                document.querySelectorAll('.quickview-size').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');

                // Cập nhật giá
                const price = this.getAttribute('data-price');
                quickviewSalePrice.textContent = formatPrice(price);
                quickviewOriginalPrice.textContent = formatPrice(Math.round(price * 1.2));
            });
            quickviewSizeOptions.appendChild(sizeOption);
        });

        // Cập nhật metadata
        quickviewCategory.textContent = product.category;
        quickviewBrandMeta.textContent = product.brand;
        quickviewSku.textContent = product.sku;

        // Cập nhật link xem chi tiết
        quickviewViewDetails.href = `/shop/product/${product.id}`;

        // Cập nhật data-product-id cho nút thêm vào giỏ hàng
        quickviewAddToCart.setAttribute('data-product-id', product.id);
    }

    // Hàm định dạng giá
    function formatPrice(price) {
        return price.toLocaleString('vi-VN') + 'đ';
    }

    // Thêm sự kiện cho các nút "Xem nhanh" trên trang
    function setupQuickViewButtons() {
        document.querySelectorAll('.quick-view-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.product-card');
                const productId = productCard.getAttribute('data-product-id');
                openQuickView(productId);
            });
        });
    }

    // Thiết lập các nút QuickView khi trang được tải
    setupQuickViewButtons();

    // Thiết lập lại các nút QuickView khi nội dung trang thay đổi (ví dụ: khi lọc sản phẩm)
    // Bạn có thể gọi setupQuickViewButtons() sau khi cập nhật nội dung trang

    // Đăng ký hàm openQuickView vào window để có thể gọi từ bên ngoài
    window.openQuickView = openQuickView;

    // Log để kiểm tra
    console.log('QuickView initialized, openQuickView function is available');
});
