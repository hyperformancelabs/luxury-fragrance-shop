# Cấu hình Cơ Sở Dữ Liệu Luxury Fragrance Shop

**Tiếng Việt**  |  **[English](README_en.md)**

Thư mục này chứa các tập lệnh và cấu hình để quản lý cơ sở dữ liệu SQL Server được sử dụng trong dự án Luxury Fragrance Shop. Cơ sở dữ liệu chạy trong container Docker để dễ dàng triển khai và đảm bảo môi trường phát triển đồng nhất.

## Tổng quan

Hệ thống cơ sở dữ liệu sử dụng:
- **Microsoft SQL Server 2022** (phiên bản mới nhất)
- **Docker** container để cô lập và tăng tính di động
- **Dockerfile** tùy chỉnh với `sqlcmd` đã được cài đặt sẵn
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
- `MSSQL_DATABASE`: Tên cơ sở dữ liệu mặc định sẽ được tạo

### 2. Các lệnh quản lý cơ bản

Các tập lệnh sau có sẵn để quản lý container cơ sở dữ liệu của bạn:

| Tập lệnh | Mô tả | Cách sử dụng |
|--------|-------------|-------|
| `./start.sh` | Khởi động container cơ sở dữ liệu | `./start.sh [env_file]` |
| `./stop.sh` | Dừng container cơ sở dữ liệu | `./stop.sh [env_file]` |
| `./reset.sh` | Đặt lại cơ sở dữ liệu (dữ liệu sẽ bị mất) | `./reset.sh [env_file]` |
| `./delete.sh` | Xóa hoàn toàn container và volumes | `./delete.sh [env_file]` |
| `./fast-check.sh` | Kiểm tra nhanh trạng thái DB, hiển thị danh sách databases và users | `./fast-check.sh [env_file]` |
| `./restart.sh` | Khởi động lại container cơ sở dữ liệu | `./restart.sh [env_file]` |
| `./dbctl.sh` | Công cụ quản lý database toàn diện (xem phần bên dưới) | `./dbctl.sh [options]` |
| `./synconfigs.sh` | Đồng bộ hóa các biến môi trường giữa thư mục gốc và database | `./synconfigs.sh` |

Đối với tất cả các tập lệnh, bạn có thể tùy chọn chỉ định đường dẫn tệp môi trường tùy chỉnh làm đối số đầu tiên. Nếu không được chỉ định, các tập lệnh sẽ tìm kiếm `.env.local` trước, sau đó là `.env`.

### 3. Công cụ quản lý SQL Server (dbctl.sh)

`dbctl.sh` là một công cụ toàn diện để quản lý cơ sở dữ liệu SQL Server:

**Các tính năng chính:**
- Tạo và xóa database
- Tạo và xóa tài khoản người dùng
- Quản lý quyền hạn người dùng
- Thay đổi mật khẩu người dùng
- Hiển thị thông tin hệ thống và cơ sở dữ liệu

**Cách sử dụng:**

1. **Chế độ tương tác:** Chạy không có tham số để mở menu tương tác
   ```bash
   ./dbctl.sh
   ```

2. **Chế độ lệnh trực tiếp:**
   ```bash
   ./dbctl.sh --create-db mydb
   ./dbctl.sh --create-user username password
   ./dbctl.sh --modify-user username mydb
   ./dbctl.sh --show-info
   ```

3. **Tùy chọn file môi trường:**
   ```bash
   ./dbctl.sh --env .env.custom
   ```

Để xem tất cả các tùy chọn:
```bash
./dbctl.sh --help
```

### 4. Công cụ đồng bộ hóa cấu hình (synconfigs.sh)

Script `synconfigs.sh` giúp đồng bộ hóa các biến môi trường giữa các file cấu hình khác nhau:

- Đồng bộ từ file môi trường gốc (thư mục dự án) sang thư mục database
- Hỗ trợ cả `.env`, `.env.example` và `.env.local`
- Tự động phát hiện các biến chung và chỉ đồng bộ những biến này
- Bảo toàn cấu trúc và định dạng của file đích

### 5. Thông tin kết nối cơ sở dữ liệu

Khi cơ sở dữ liệu đang chạy, bạn có thể kết nối với nó bằng:

- **Máy chủ**: `localhost` hoặc `127.0.0.1`
- **Cổng**: Như được cấu hình trong tệp `.env` của bạn (mặc định: 1433)
- **Tên người dùng**: `sa` hoặc tài khoản bạn đã tạo
- **Mật khẩu**: Như được cấu hình trong tệp môi trường
- **Cơ sở dữ liệu**: Sử dụng giá trị `MSSQL_DATABASE` hoặc database bạn đã tạo với `dbctl.sh`

## Cấu trúc Docker

Dự án sử dụng hai file cấu hình chính để thiết lập môi trường:

### Dockerfile
- Dựa trên hình ảnh chính thức SQL Server 2022
- Cài đặt sẵn `sqlcmd` và các công cụ liên quan
- Cấu hình PATH để có thể sử dụng `sqlcmd` dễ dàng
- Tự động chấp nhận giấy phép EULA của Microsoft

### docker-compose.yml
- Xây dựng container từ Dockerfile
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
- Sử dụng `dbctl.sh` để tạo người dùng có quyền hạn phù hợp thay vì sử dụng tài khoản SA cho ứng dụng.
- Xem xét giới hạn quyền truy cập vào cổng cơ sở dữ liệu trong môi trường sản xuất.
- Sao lưu dữ liệu của bạn thường xuyên nếu được sử dụng trong sản xuất.