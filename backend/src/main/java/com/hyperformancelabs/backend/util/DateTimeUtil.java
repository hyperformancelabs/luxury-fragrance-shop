package com.hyperformancelabs.backend.util;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Lớp tiện ích xử lý thời gian cho ứng dụng
 */
public class DateTimeUtil {
    private static final Logger logger = LoggerFactory.getLogger(DateTimeUtil.class);
    private static final String SYSTEM_TIMEZONE = "Asia/Ho_Chi_Minh"; // Timezone mặc định cho Việt Nam
    private static final int HOUR_OFFSET = 7; // Độ lệch giờ cần điều chỉnh
    
    /**
     * Lấy thời gian hiện tại chính xác theo múi giờ hệ thống
     * @return LocalDateTime đại diện cho thời gian hiện tại
     */
    public static LocalDateTime getCurrentDateTime() {
        // Lấy thời gian hiện tại theo múi giờ hệ thống
        ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneId.of(SYSTEM_TIMEZONE));
        LocalDateTime now = zonedDateTime.toLocalDateTime();
        
        // Điều chỉnh thời gian để bù đắp cho sự chênh lệch múi giờ
        LocalDateTime adjustedTime = now.plusHours(HOUR_OFFSET);
        
        // Ghi log cả thời gian gốc và thời gian đã điều chỉnh
        logger.info("Original system time ({}): {}", SYSTEM_TIMEZONE, 
                now.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        logger.info("Adjusted time (+{} hours): {}", HOUR_OFFSET,
                adjustedTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        return adjustedTime;
    }
    
    /**
     * Kết hợp ngày từ input với thời gian hiện tại đã điều chỉnh
     * @param date Ngày được chỉ định
     * @return LocalDateTime kết hợp giữa ngày được chỉ định và thời gian hiện tại đã điều chỉnh
     */
    public static LocalDateTime combineDateWithCurrentTime(LocalDateTime date) {
        LocalDateTime now = getCurrentDateTime();
        return date.withHour(now.getHour())
                .withMinute(now.getMinute())
                .withSecond(now.getSecond())
                .withNano(now.getNano());
    }
} 