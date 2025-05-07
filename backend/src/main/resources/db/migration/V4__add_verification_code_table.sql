-- Bảng lưu trữ mã xác thực
CREATE TABLE [verification_code] (
    [code_id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [code] VARCHAR(10) NOT NULL,
    [email] VARCHAR(100) NOT NULL,
    [type] VARCHAR(50) NOT NULL, -- Loại xác thực: PASSWORD_RESET, EMAIL_VERIFICATION, v.v.
    [created_at] DATETIME NOT NULL DEFAULT GETDATE(),
    [expires_at] DATETIME NOT NULL,
    [used] BIT NOT NULL DEFAULT 0,
    [user_type] VARCHAR(20) NOT NULL, -- EMPLOYEE, CUSTOMER, v.v.
    [user_id] INT NULL, -- ID của người dùng (có thể là employee_id hoặc customer_id)
    [metadata] NVARCHAR(MAX) NULL -- Dữ liệu bổ sung nếu cần
);

-- Index để tìm kiếm nhanh
CREATE INDEX [IX_verification_code_email] ON [verification_code] ([email]);
CREATE INDEX [IX_verification_code_code] ON [verification_code] ([code]);
CREATE INDEX [IX_verification_code_user] ON [verification_code] ([user_type], [user_id]);
