package com.hyperformancelabs.backend.functional;

import com.hyperformancelabs.backend.dto.BrandRequestDto;
import com.hyperformancelabs.backend.payload.ApiResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class AdminFlowFunctionalTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    /**
     * Thực hiện luồng chức năng: Tạo thương hiệu mới → Lấy danh sách thương hiệu.
     * TestRestTemplate giúp gửi HTTP request thực tế tới server khởi chạy ở port ngẫu nhiên.
     * Với profile "test" chúng ta có thể tắt bảo mật qua application-test.yml (nếu cần).
     */
    @Test
    void createBrand_thenListBrands() {
        String baseUrl = "http://localhost:" + port + "/api/v1/emp";

        // 1) Tạo thương hiệu
        BrandRequestDto req = new BrandRequestDto();
        req.setBrandName("JUnitBrand" + System.currentTimeMillis());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<BrandRequestDto> entity = new HttpEntity<>(req, headers);

        ResponseEntity<ApiResponse> createResp = restTemplate.postForEntity(baseUrl + "/brands", entity, ApiResponse.class);
        Assertions.assertEquals(HttpStatus.CREATED, createResp.getStatusCode(), "Tạo brand phải trả về 201");

        // 2) Gọi GET danh sách thương hiệu
        ResponseEntity<ApiResponse> listResp = restTemplate.getForEntity(baseUrl + "/brands", ApiResponse.class);
        Assertions.assertEquals(HttpStatus.OK, listResp.getStatusCode());
        Assertions.assertNotNull(listResp.getBody());
        Assertions.assertEquals("success", listResp.getBody().getStatus());
    }

    @Test
    void createBrand_withLongName_shouldFail400() {
        String baseUrl = "http://localhost:" + port + "/api/v1/emp";

        BrandRequestDto longReq = new BrandRequestDto();
        longReq.setBrandName("A".repeat(101)); // 101 chars

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<BrandRequestDto> entity = new HttpEntity<>(longReq, headers);

        ResponseEntity<ApiResponse> resp = restTemplate.postForEntity(baseUrl + "/brands", entity, ApiResponse.class);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST, resp.getStatusCode());
    }
} 