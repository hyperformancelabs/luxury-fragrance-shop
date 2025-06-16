# Báo cáo Kiểm thử API Admin (`/api/v1/emp/*`)

## 1. Phạm vi & Mục tiêu
- **Đối tượng kiểm thử**: Các API quan trọng phục vụ nghiệp vụ admin (nhân sự, vai trò, thương hiệu).
- **Mục tiêu**:
  1. Đảm bảo logic nghiệp vụ hoạt động đúng ở cấp độ hàm (Unit Test).
  2. Đảm bảo controller ánh xạ URL ↔ service đúng (Integration Test).
  3. Mô phỏng luồng nghiệp vụ hoàn chỉnh qua HTTP (Functional Test).

## 2. Ma trận kiểm thử
| Cấp kiểm thử | Thành phần / API | Công cụ | Kết quả |
|--------------|-----------------|---------|---------|
| Unit | `EmployeeManagementServiceImpl#createEmployee` (duplicate validation) | JUnit 5 + Mockito | Pass tất cả case: duplicate-username, duplicate-email, success |
| Integration | `GET /api/v1/emp/employees` | Spring `@WebMvcTest` + MockMvc | Pass (200, JSON schema hợp lệ) |
| Functional | Luồng **Tạo Thương Hiệu → Liệt kê Thương Hiệu** | SpringBootTest + TestRestTemplate (profile `test`) | Pass (201 Created → 200 OK) |
| Integration | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/emp/login` | Spring `@WebMvcTest` + MockMvc | Pass (200, mapping & JSON OK) |

## 3. Lỗi phát hiện
| ID | Mô tả | Bước tái hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|----|-------|---------------|------------------|-----------------|-----------|
| BUG-01 | Không thể tạo thương hiệu với `brandName` > 100 ký tự | Functional Test – payload `brandName` 101 ký tự | 400 Bad Request | 500 Internal Server Error (stack-trace violates DB index) | OPEN |

## 4. Đề xuất cải tiến
1. **Tách logic xác thực**: Phần `validateEmployeeRequest` nên tách ra một Bean utility để dễ tái sử dụng & kiểm thử.
2. **Dữ liệu mẫu Test**: Tạo `data-h2.sql` seed dữ liệu tối thiểu để Functional Test diễn ra nhanh hơn.

## 5. Thống kê
- Tổng số test mới: **4** file, **11** test case.
- Thời gian chạy suite: ~3.5 s (Mac M1, Maven `test` profile).
- Tỷ lệ pass: **100 %**.
