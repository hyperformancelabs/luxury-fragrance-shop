document.addEventListener('DOMContentLoaded', function() {
    // Sort buttons
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            sortButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // In a real implementation, this would trigger a form submission or AJAX request
            // to sort the products based on the selected option
            const sortOption = this.textContent.trim();
            console.log('Sorting by:', sortOption);

            // For demo purposes, we'll just reload the page with a sort parameter
            // const currentUrl = new URL(window.location.href);
            // currentUrl.searchParams.set('sort', sortOption.toLowerCase().replace(/ /g, '-'));
            // window.location.href = currentUrl.toString();
        });
    });

    // Quick view buttons - Handled by quickview.js
    // We're keeping this commented out as a reference
    /*
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // In a real implementation, this would open a modal with product details
            // For now, we'll just log to console
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.card-title').textContent;
            console.log('Quick view for:', productTitle);
        });
    });
    */

    // Wishlist buttons
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Toggle active class
            this.classList.toggle('active');

            // In a real implementation, this would add the product to the wishlist
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productTitle = productCard.querySelector('.card-title').textContent;

            if (this.classList.contains('active')) {
                this.textContent = 'Đã thích'; // Đã thích
                console.log('Added to wishlist:', productTitle, 'ID:', productId);
                // Here you would make an AJAX call to add to wishlist
            } else {
                this.textContent = 'Yêu thích'; // Yêu thích
                console.log('Removed from wishlist:', productTitle, 'ID:', productId);
                // Here you would make an AJAX call to remove from wishlist
            }
        });
    });

    // Filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // In a real implementation, this would trigger a form submission or AJAX request
            // to filter the products based on the selected options
            console.log('Filter changed:', this.id, 'Checked:', this.checked);

            // For demo purposes, we'll just count the number of active filters
            const activeFilters = document.querySelectorAll('.filter-option input[type="checkbox"]:checked').length;
            console.log('Active filters:', activeFilters);
        });
    });

    // Price range slider
    const priceRangeSlider = document.querySelector('input[type="range"]');
    if (priceRangeSlider) {
        priceRangeSlider.addEventListener('input', function() {
            // In a real implementation, this would update the price display
            const value = this.value;
            const formattedValue = parseInt(value).toLocaleString('vi-VN') + 'đ';
            console.log('Price range changed:', formattedValue);
        });
    }
});
