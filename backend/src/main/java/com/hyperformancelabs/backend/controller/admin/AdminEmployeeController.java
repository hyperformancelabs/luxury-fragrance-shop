//package com.hyperformancelabs.backend.controller.admin;
//
//import com.hyperformancelabs.backend.service.EmployeeService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//
//import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@Controller
//@RequestMapping("/admin/employees")
//public class AdminEmployeeController {
//
//    @Autowired
//    private EmployeeService employeeService;
//
//    @GetMapping
//    public String listEmployees(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(required = false) String search,
//            Model model) {
//
//        // In a real application, this would use employeeService.getEmployees(page, search)
//        // For now, we'll use sample data
//
//        List<Map<String, Object>> employees = new ArrayList<>();
//
//        // Sample employee data
//        employees.add(createSampleEmployee(1, "admin", "Admin User", "0912345678", "admin@shop.com", "active"));
//        employees.add(createSampleEmployee(2, "manager", "Manager User", "0923456789", "manager@shop.com", "active"));
//        employees.add(createSampleEmployee(3, "staff1", "Staff User 1", "0934567890", "staff1@shop.com", "active"));
//        employees.add(createSampleEmployee(4, "staff2", "Staff User 2", "0945678901", "staff2@shop.com", "inactive"));
//        employees.add(createSampleEmployee(5, "staff3", "Staff User 3", "0956789012", "staff3@shop.com", "on_leave"));
//
//        model.addAttribute("employees", employees);
//        model.addAttribute("currentPage", page);
//        model.addAttribute("totalPages", 2); // Sample value
//        model.addAttribute("search", search);
//
//        return "admin/employees/list";
//    }
//
//    @GetMapping("/{id}")
//    public String viewEmployee(@PathVariable("id") Integer id, Model model) {
//        // In a real application, this would use employeeService.getEmployeeById(id)
//        // For now, we'll use sample data
//
//        Map<String, Object> employee = createSampleEmployee(id, "admin", "Admin User", "0912345678", "admin@shop.com", "active");
//        employee.put("address", "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM");
//        employee.put("startDate", LocalDate.now().minusYears(1));
//        employee.put("dateOfBirth", LocalDate.now().minusYears(30));
//        employee.put("roles", List.of("ADMIN", "MANAGER"));
//
//        model.addAttribute("employee", employee);
//
//        // Sample performance data
//        Map<String, Object> performance = new HashMap<>();
//        performance.put("processedOrdersCount", 156);
//        performance.put("inventoryOperationsCount", 78);
//        performance.put("performanceScore", 92);
//
//        model.addAttribute("performance", performance);
//
//        return "admin/employees/detail";
//    }
//
//    private Map<String, Object> createSampleEmployee(int id, String username, String fullName, String phone, String email, String status) {
//        Map<String, Object> employee = new HashMap<>();
//        employee.put("id", id);
//        employee.put("username", username);
//        employee.put("fullName", fullName);
//        employee.put("phoneNumber", phone);
//        employee.put("email", email);
//        employee.put("status", status);
//        return employee;
//    }
//}
