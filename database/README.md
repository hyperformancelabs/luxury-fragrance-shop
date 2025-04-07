# Cấu hình Cơ Sở Dữ Liệu Luxury Fragrance Shop

**Tiếng Việt**  |  **[English](README_en.md)**

Thư mục này chứa các tập lệnh và cấu hình để quản lý cơ sở dữ liệu SQL Server được sử dụng trong dự án Luxury Fragrance Shop. Cơ sở dữ liệu chạy trong container Docker để dễ dàng triển khai và đảm bảo môi trường phát triển đồng nhất.

## Tổng quan

Hệ thống cơ sở dữ liệu sử dụng:
- **Microsoft SQL Server 2022** (phiên bản mới nhất)
- **Docker** container để cô lập và tăng tính di động
- **Bash scripts** để dễ dàng thực hiện các thao tác quản lý

## Yêu cầu

Trước khi thiết lập cơ sở dữ liệu, hãy đảm bảo bạn có:

1. [Docker](https://www.docker.com/get-started) đã được cài đặt và đang chạy
2. [Docker Compose](https://docs.docker.com/compose/install/) đã được cài đặt
3. Kiến thức cơ bản về các lệnh shell (Bash)
4. Hệ thống với đủ tài nguyên để chạy SQL Server (tối thiểu 2GB RAM)

## Hướng dẫn thiết lập

### 1. Cấu hình môi trường

Sao chép tệp môi trường mẫu để tạo cấu hình của bạn:

```bash
cp .env.example .env.local  # hoặc .env nếu bạn thích
```

Chỉnh sửa tệp mới để điều chỉnh:
- `MSSQL_SA_PASSWORD`: Chọn mật khẩu mạnh cho người dùng SA
- `MSSQL_PORT`: Thay đổi nếu cổng 1433 đã được sử dụng trên hệ thống của bạn
- `CONTAINER_NAME`: Tùy chỉnh tên container nếu cần

### 2. Các lệnh có sẵn

Các tập lệnh sau có sẵn để quản lý container cơ sở dữ liệu của bạn:

| Tập lệnh | Mô tả | Cách sử dụng |
|--------|-------------|-------|
| `./start.sh` | Khởi động container cơ sở dữ liệu | `./start.sh [env_file]` |
| `./stop.sh` | Dừng container cơ sở dữ liệu | `./stop.sh [env_file]` |
| `./reset.sh` | Đặt lại cơ sở dữ liệu (dữ liệu sẽ bị mất) | `./reset.sh [env_file]` |
| `./delete.sh` | Xóa hoàn toàn container và volumes | `./delete.sh [env_file]` |
| `./fast-check.sh` | Kiểm tra xem cơ sở dữ liệu có đang chạy và truy cập được không | `./fast-check.sh [env_file]` |

Đối với tất cả các tập lệnh, bạn có thể tùy chọn chỉ định đường dẫn tệp môi trường tùy chỉnh làm đối số đầu tiên. Nếu không được chỉ định, các tập lệnh sẽ tìm kiếm `.env.local` trước, sau đó là `.env`.

### 3. Thông tin kết nối cơ sở dữ liệu

Khi cơ sở dữ liệu đang chạy, bạn có thể kết nối với nó bằng:

- **Máy chủ**: `localhost` hoặc `127.0.0.1`
- **Cổng**: Như được cấu hình trong tệp `.env` của bạn (mặc định: 1433)
- **Tên người dùng**: `sa`
- **Mật khẩu**: Như được cấu hình trong tệp `.env` của bạn
- **Cơ sở dữ liệu**: Theo mặc định, không có cơ sở dữ liệu nào được tạo. Bạn sẽ cần tạo một cơ sở dữ liệu sau khi kết nối.

## Cấu hình Docker Compose

Tệp `docker-compose.yml` xác định:
- Phiên bản hình ảnh SQL Server
- Cài đặt nền tảng (linux/amd64)
- Cấu hình biến môi trường
- Ánh xạ cổng
- Volume lưu trữ liên tục
- Tham số kiểm tra sức khỏe

## Lưu trữ dữ liệu

Các tệp cơ sở dữ liệu được lưu trữ trong một volume Docker có tên `db_data`. Điều này đảm bảo rằng dữ liệu của bạn vẫn tồn tại giữa các lần khởi động lại container trừ khi bạn sử dụng rõ ràng `reset.sh` hoặc `delete.sh`.

## Xử lý sự cố

Các vấn đề thường gặp và giải pháp:

1. **Cổng đã được sử dụng**: Thay đổi `MSSQL_PORT` trong tệp môi trường của bạn.
2. **Container không khởi động**: Kiểm tra nhật ký Docker với `docker logs <container_name>`.
3. **Kết nối bị từ chối**: Chạy `./fast-check.sh` để xác minh cơ sở dữ liệu đang chạy đúng.
4. **Quyền bị từ chối trên các tập lệnh**: Chạy `chmod +x *.sh` để làm cho các tập lệnh có thể thực thi.

## Lưu ý về bảo mật

- Mật khẩu SA mặc định trong `.env.example` chỉ để minh họa. Luôn sử dụng mật khẩu mạnh, độc nhất trong sản xuất.
- Xem xét giới hạn quyền truy cập vào cổng cơ sở dữ liệu trong môi trường sản xuất.
- Sao lưu dữ liệu của bạn thường xuyên nếu được sử dụng trong sản xuất.