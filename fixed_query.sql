-- Truy vấn SQL để xác định top 10 sản phẩm bán chạy nhất
SELECT TOP 10
    p.product_id,
    p.product_name,
    SUM(oi.quantity) AS total_quantity_sold
FROM 
    [Order] o
JOIN 
    OrderItem oi ON o.order_id = oi.order_id
JOIN 
    Product p ON oi.product_id = p.product_id
WHERE 
    o.order_status = 'đã hoàn thành'
GROUP BY 
    p.product_id, p.product_name
ORDER BY 
    total_quantity_sold DESC;
