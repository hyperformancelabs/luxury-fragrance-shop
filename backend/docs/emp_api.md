| Tên API | Method | Endpoint | Params | Request Body | Response | Status Code | Ghi chú |
|---------|--------|----------|--------|--------------|----------|-------------|---------|
| Danh sách nhân viên | GET | `/api/v1/emp/employees` | page, size, status, search, roleId | _None_ | ApiResponse<Map> | 200/400 | - |
| Chi tiết nhân viên | GET | `/api/v1/emp/employees/{employeeId}` | employeeId | _None_ | ApiResponse<EmployeeListResponse> | 200/404/400 | - |
| Tạo nhân viên | POST | `/api/v1/emp/employees` | - | EmployeeRegisterRequest | ApiResponse<Integer> | 201/400/500 | - |
| Cập nhật nhân viên | PUT | `/api/v1/emp/employees/{employeeId}` | employeeId | EmployeeUpdateRequest | ApiResponse<String> | 200/404/400/500 | - |
| Xóa nhân viên | DELETE | `/api/v1/emp/employees/{employeeId}` | employeeId, force | _None_ | ApiResponse<String> | 200/404/400/500 | Hard delete |
| Gán vai trò NV | POST | `/api/v1/emp/employees/{employeeId}/roles` | employeeId | EmployeeRoleRequest | ApiResponse<Void> | 200 | - |
| Xóa vai trò NV | DELETE | `/api/v1/emp/employees/{employeeId}/roles` | employeeId | EmployeeRoleRequest | ApiResponse<Void> | 200 | - |
| Thay thế vai trò NV | PUT | `/api/v1/emp/employees/{employeeId}/roles` | employeeId | EmployeeRoleRequest | ApiResponse<Void> | 200/404/500 | - |
| Danh sách thương hiệu | GET | `/api/v1/emp/brands` | - | _None_ | ApiResponse<List<BrandDto>> | 200/400 | - |
| Tìm kiếm thương hiệu | GET | `/api/v1/emp/brands/search` | query, limit | _None_ | ApiResponse<SearchResponseDto<BrandDto>> | 200 | - |
| Chi tiết thương hiệu | GET | `/api/v1/emp/brands/{brandId}` | brandId | _None_ | ApiResponse<BrandDto> | 200/404/500 | - |
| Tạo thương hiệu | POST | `/api/v1/emp/brands` | - | BrandRequestDto | ApiResponse<BrandDto> | 201/409/500 | - |
| Cập nhật thương hiệu | PUT | `/api/v1/emp/brands/{brandId}` | brandId | BrandRequestDto | ApiResponse<BrandDto> | 200/404/409/500 | - |
| Xóa thương hiệu | DELETE | `/api/v1/emp/brands/{brandId}` | brandId | _None_ | ApiResponse<Void> | 200/404/500 | - |
| Danh sách vai trò | GET | `/api/v1/emp/roles` | page, size, search | _None_ | ApiResponse<Map> | 200/400 | - |
| Tất cả vai trò | GET | `/api/v1/emp/roles/all` | - | _None_ | ApiResponse<List<RoleResponse>> | 200/400 | - |
| Vai trò active | GET | `/api/v1/emp/roles/active` | - | _None_ | ApiResponse<List<RoleResponse>> | 200/400 | - |
| Vai trò + số nhân viên | GET | `/api/v1/emp/roles/with-employee-count` | - | _None_ | ApiResponse<List<Map>> | 200/400 | - |
| Chi tiết vai trò | GET | `/api/v1/emp/roles/{roleId}` | roleId | _None_ | ApiResponse<RoleResponse> | 200/404/400 | - |
| Nhân viên theo vai trò | GET | `/api/v1/emp/roles/{roleId}/employees` | roleId | _None_ | ApiResponse<List<Map>> | 200/404/400 | - |
| Tạo vai trò | POST | `/api/v1/emp/roles` | - | RoleRequest | ApiResponse<Integer> | 201/400/500 | - |
| Cập nhật vai trò | PUT | `/api/v1/emp/roles/{roleId}` | roleId | RoleRequest | ApiResponse<Void> | 200/404/400/500 | - |
| Xóa vai trò | DELETE | `/api/v1/emp/roles/{roleId}` | roleId, force | _None_ | ApiResponse<Void> | 200/404/400/500 | - |
| Thêm quyền cho vai trò | POST | `/api/v1/emp/roles/{roleId}/permissions` | roleId | RolePermissionRequest | ApiResponse<Void> | 200/404/500 | - |
| Xóa quyền khỏi vai trò | DELETE | `/api/v1/emp/roles/{roleId}/permissions` | roleId | RolePermissionRequest | ApiResponse<Void> | 200/404/500 | - |
| Đặt vai trò mặc định | PUT | `/api/v1/emp/roles/{roleId}/default` | roleId | _None_ | ApiResponse<Void> | 200/404/500 | - |
| Danh sách quyền | GET | `/api/v1/emp/permissions` | page, size | _None_ | ApiResponse<Map> | 200 | - |
| Tất cả quyền | GET | `/api/v1/emp/permissions/all` | - | _None_ | ApiResponse<List<PermissionResponse>> | 200 | - |
| Chi tiết quyền | GET | `/api/v1/emp/permissions/{permissionId}` | permissionId | _None_ | ApiResponse<PermissionResponse> | 200/404 | - |
| Quyền theo vai trò | GET | `/api/v1/emp/permissions/role/{roleId}` | roleId | _None_ | ApiResponse<List<PermissionResponse>> | 200/404 | - |
| Quyền chưa gán | GET | `/api/v1/emp/permissions/role/{roleId}/available` | roleId | _None_ | ApiResponse<List<PermissionResponse>> | 200/404 | - |
| Danh sách sản phẩm | GET | `/api/v1/emp/products` | page,size,sort,brandId,productName | _None_ | ApiResponse<ProductListResponse> | 200/500 | - |
| Chi tiết sản phẩm | GET | `/api/v1/emp/products/{productId}` | productId | _None_ | ApiResponse<ProductDTO> | 200/404/500 | - |
| Tạo sản phẩm | POST | `/api/v1/emp/products` | - | ProductCreateRequest | ApiResponse<ProductDTO> | 201/404/409/500 | - |
| Cập nhật sản phẩm | PUT | `/api/v1/emp/products/{productId}` | productId | ProductUpdateRequest | ApiResponse<ProductDTO> | 200/404/409/500 | - |
| Xóa sản phẩm | DELETE | `/api/v1/emp/products/{productId}` | productId | _None_ | ApiResponse<Void> | 200/404/500 | - |
| Search sản phẩm autocomplete | GET | `/api/v1/emp/products/search` | query, limit | _None_ | ApiResponse<SearchResponseDto> | 200 | - |
| Danh sách biến thể | GET | `/api/v1/emp/products/{productId}/variants` | productId,page,size | _None_ | ApiResponse<ProductVariantListResponse> | 200/404/500 | - |
| Chi tiết biến thể | GET | `/api/v1/emp/products/{productId}/variants/{variantId}` | ids | _None_ | ApiResponse<ProductVariantDTO> | 200/404/500 | - |
| Tạo biến thể | POST | `/api/v1/emp/products/{productId}/variants` | productId | ProductVariantCreateRequest | ApiResponse<ProductVariantDTO> | 201/404/409/500 | - |
| Cập nhật biến thể | PUT | `/api/v1/emp/products/{productId}/variants/{variantId}` | ids | ProductVariantUpdateRequest | ApiResponse<ProductVariantDTO> | 200/404/409/500 | - |
| Xóa biến thể | DELETE | `/api/v1/emp/products/{productId}/variants/{variantId}` | ids | _None_ | ApiResponse<Void> | 200/404/500 | - |
| Danh sách chi tiết sản phẩm | GET | `/api/v1/emp/products/{productId}/details` | productId | _None_ | ApiResponse<ProductDetailListResponse> | 200/404/500 | - |
| Tạo chi tiết SP | POST | `/api/v1/emp/products/{productId}/details` | productId | ProductDetailCreateRequest | ApiResponse<ProductDetailDTO> | 201/404/409/500 | - |
| Cập nhật chi tiết SP | PUT | `/api/v1/emp/products/{productId}/details/{detailId}` | ids | ProductDetailUpdateRequest | ApiResponse<ProductDetailDTO> | 200/404/409/500 | - |
| Xóa chi tiết SP | DELETE | `/api/v1/emp/products/{productId}/details/{detailId}` | ids | _None_ | ApiResponse<Void> | 200/404/500 | - |
| Danh sách vật liệu | GET | `/api/v1/emp/materials` | page,size,sort,materialName | _None_ | ApiResponse<MaterialListResponse> | 200/500 | - |
| Chi tiết vật liệu | GET | `/api/v1/emp/materials/{materialId}` | materialId | _None_ | ApiResponse<MaterialDTO> | 200/404/500 | - |
| Tạo vật liệu | POST | `/api/v1/emp/materials` | - | MaterialCreateRequest | ApiResponse<MaterialDTO> | 201/409/500 | - |
| Cập nhật vật liệu | PUT | `/api/v1/emp/materials/{materialId}` | materialId | MaterialUpdateRequest | ApiResponse<MaterialDTO> | 200/404/409/500 | - |
| Xóa vật liệu | DELETE | `/api/v1/emp/materials/{materialId}` | materialId | _None_ | ApiResponse<Void> | 200/404/500 | - |
| Search vật liệu | GET | `/api/v1/emp/materials/search` | query,page,size | _None_ | ApiResponse<MaterialListResponse> | 200/500 | - |
| Giao dịch vật liệu list | GET | `/api/v1/emp/material-transactions` | nhiều filter | _None_ | ApiResponse<MaterialTransactionListResponse> | 200/500 | - |
| Chi tiết GD vật liệu | GET | `/api/v1/emp/material-transactions/{transactionId}` | transactionId | _None_ | ApiResponse<MaterialTransactionDTO> | 200/500 | - |
| Tạo GD vật liệu | POST | `/api/v1/emp/material-transactions` | - | MaterialTransactionCreateRequest | ApiResponse<MaterialTransactionDTO> | 201/400 | - |
| Cập nhật GD vật liệu | PUT | `/api/v1/emp/material-transactions/{transactionId}` | id | MaterialTransactionUpdateRequest | ApiResponse<MaterialTransactionDTO> | 200/404/400/500 | - |
| Xóa GD vật liệu | DELETE | `/api/v1/emp/material-transactions/{transactionId}` | id | _None_ | ApiResponse<Void> | 200/404/400 | - |
| Giao dịch tồn kho list | GET | `/api/v1/emp/inventory-transactions` | nhiều filter | _None_ | ApiResponse<InventoryTransactionListResponse> | 200/500 | - |
| Chi tiết GD tồn kho | GET | `/api/v1/emp/inventory-transactions/{transactionId}` | id | _None_ | ApiResponse<InventoryTransactionDTO> | 200/404/500 | - |
| Tạo GD tồn kho | POST | `/api/v1/emp/inventory-transactions` | - | InventoryTransactionCreateRequest | ApiResponse<InventoryTransactionDTO> | 201/404/400/500 | - |
| Cập nhật GD tồn kho | PUT | `/api/v1/emp/inventory-transactions/{transactionId}` | id | InventoryTransactionUpdateRequest | ApiResponse<InventoryTransactionDTO> | 200/404/400/500 | - |
| Xóa GD tồn kho | DELETE | `/api/v1/emp/inventory-transactions/{transactionId}` | id | _None_ | ApiResponse<Void> | 200/404/400/500 | - |
| Danh sách khách hàng | GET | `/api/v1/emp/customers` | page,size,sortBy,... filters | _None_ | ApiResponse<CustomerListResponse> | 200/500 | - |
| Search KH | GET | `/api/v1/emp/customers/search` | keyword,page,size | _None_ | ApiResponse<CustomerListResponse> | 200/500 | - |
| Chi tiết KH | GET | `/api/v1/emp/customers/{customerId}` | id | _None_ | ApiResponse<CustomerDTO> | 200/400 | - |
| Tạo KH | POST | `/api/v1/emp/customers` | - | CustomerCreateRequest | ApiResponse<CustomerDTO> | 201/400 | - |
| Cập nhật KH | PUT | `/api/v1/emp/customers/{customerId}` | id | CustomerUpdateRequest | ApiResponse<CustomerDTO> | 200/400 | - |
| Xóa KH | DELETE | `/api/v1/emp/customers/{customerId}` | id | _None_ | ApiResponse<Void> | 200/400 | Soft delete? |
| Update status KH | PATCH | `/api/v1/emp/customers/{customerId}/status` | id | StatusUpdateRequest | ApiResponse<CustomerDTO> | 200/400 | - |
| Update rating KH | PATCH | `/api/v1/emp/customers/{customerId}/rating` | id | RatingUpdateRequest | ApiResponse<CustomerDTO> | 200/400 | - |
| Adjust loyalty points | PATCH | `/api/v1/emp/customers/{customerId}/loyalty-points` | id | LoyaltyPointsAdjustRequest | ApiResponse<CustomerDTO> | 200/400 | - |
| Carts của KH | GET | `/api/v1/emp/customers/{customerId}/carts` | id,page,size,status | _None_ | ApiResponse<CartListResponse> | 200/400 | - |
| Chi tiết cart | GET | `/api/v1/emp/customers/{customerId}/carts/{cartId}` | ids | _None_ | ApiResponse<CartDTO> | 200/400 | - |
| Wishlist KH | GET | `/api/v1/emp/customers/{customerId}/wishlist` | id | _None_ | ApiResponse<List<WishlistDTO>> | 200/400 | - |
| Xóa wishlist item | DELETE | `/api/v1/emp/customers/{customerId}/wishlist/{wishlistId}` | ids | _None_ | ApiResponse<Void> | 200/400 | - |
| Payment methods KH | GET | `/api/v1/emp/customers/{customerId}/payment-methods` | id | _None_ | ApiResponse<List<CustomerPaymentMethodDTO>> | 200/400 | - |
| Thêm payment KH | POST | `/api/v1/emp/customers/{customerId}/payment-methods` | id | CustomerPaymentMethodCreateRequest | ApiResponse<CustomerPaymentMethodDTO> | 201/400 | - |
| Cập nhật payment KH | PUT | `/api/v1/emp/customers/{customerId}/payment-methods/{cpmId}` | ids | CustomerPaymentMethodUpdateRequest | ApiResponse<CustomerPaymentMethodDTO> | 200/400 | - |
| Set default payment KH | PATCH | `/api/v1/emp/customers/{customerId}/payment-methods/{cpmId}/default` | ids | _None_ | ApiResponse<Void> | 200/400 | - |
| Xóa payment KH | DELETE | `/api/v1/emp/customers/{customerId}/payment-methods/{cpmId}` | ids | _None_ | ApiResponse<Void> | 200/400 | - |
| Conversations KH | GET | `/api/v1/emp/customers/{customerId}/conversations` | id | _None_ | ApiResponse<List<ConversationDTO>> | 200/400 | - |
| Chi tiết convo | GET | `/api/v1/emp/customers/{customerId}/conversations/{convId}` | ids | _None_ | ApiResponse<ConversationDetailDTO> | 200/400 | - |
| Danh sách đơn hàng | GET | `/api/v1/emp/orders` | page,size,filters | _None_ | ApiResponse<OrderListResponse> | 200/500 | - |
| Chi tiết đơn | GET | `/api/v1/emp/orders/{orderId}` | id | _None_ | ApiResponse<OrderDetailDTO> | 200/400 | - |
| Tạo đơn thủ công | POST | `/api/v1/emp/orders` | - | AdminCreateOrderRequest | ApiResponse<Integer> | 200/400 | - |
| Cập nhật info đơn | PUT | `/api/v1/emp/orders/{orderId}` | id | UpdateOrderRequest | ApiResponse<Void> | 200/400 | - |
| Cập nhật status đơn | PUT | `/api/v1/emp/orders/{orderId}/status` | id,status | _None_ | ApiResponse<Void> | 200/400 | - |
| Hủy đơn | DELETE | `/api/v1/emp/orders/{orderId}` | id,reason | _None_ | ApiResponse<Void> | 200/400 | Soft delete |
| Thêm item đơn | POST | `/api/v1/emp/orders/{orderId}/items` | id | OrderItemRequest | ApiResponse<Integer> | 200/400 | - |
| Cập nhật item qty | PUT | `/api/v1/emp/orders/{orderId}/items/{itemId}` | ids,quantity | _None_ | ApiResponse<Void> | 200/400 | - |
| Xóa item | DELETE | `/api/v1/emp/orders/{orderId}/items/{itemId}` | ids | _None_ | ApiResponse<Void> | 200/400 | - |
| Cập nhật shipment | PUT | `/api/v1/emp/orders/{orderId}/shipment` | id | UpdateShipmentRequest | ApiResponse<Void> | 200/400 | - |
| Cập nhật payment | PUT | `/api/v1/emp/orders/{orderId}/payment` | id | UpdatePaymentRequest | ApiResponse<Void> | 200/400 | - |
| Thêm promotion | POST | `/api/v1/emp/orders/{orderId}/promotions` | id,promotionId | _None_ | ApiResponse<Void> | 200/400 | - |
| Xóa promotion | DELETE | `/api/v1/emp/orders/{orderId}/promotions/{promotionId}` | ids | _None_ | ApiResponse<Void> | 200/400 | - |
| Danh sách phương thức thanh toán (admin) | GET | `/api/v1/emp/payment-methods` | - | _None_ | ApiResponse<List<PaymentMethodDTO>> | 200 | - |
| Danh sách đơn vị vận chuyển | GET | `/api/v1/emp/shipping-providers` | - | _None_ | ApiResponse<List<String>> | 200 | - | 