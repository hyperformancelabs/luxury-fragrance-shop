package com.hyperformancelabs.backend.controller.admin;

import com.hyperformancelabs.backend.dto.EmployeeAdminDisplayDTO;
import com.hyperformancelabs.backend.dto.EmployeeDTO;
import com.hyperformancelabs.backend.service.EmployeeRoleService;
import com.hyperformancelabs.backend.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin/employees")
public class AdminEmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeRoleService employeeRoleService;

    @GetMapping
    public String listEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String roleName,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortDir,
            Model model) {

        // Làm sạch tham số
        keyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        status = (status != null && !status.trim().isEmpty()) ? status.trim() : null;
        roleName = (roleName != null && !roleName.trim().isEmpty()) ? roleName.trim() : null;
        sortField = (sortField != null && !sortField.trim().isEmpty()) ? sortField.trim() : null;
        sortDir = (sortDir != null && !sortDir.trim().isEmpty()) ? sortDir.trim() : null;

        Pageable pageable = PageRequest.of(page, 10);
        Page<EmployeeAdminDisplayDTO> employeesPage = employeeService.findEmployeesWithFilters(
                status, roleName, keyword, sortField, sortDir, pageable
        );

        model.addAttribute("employees", employeesPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", employeesPage.getTotalPages());
        model.addAttribute("keyword", keyword);
        model.addAttribute("status", status);
        model.addAttribute("roleName", roleName);
        model.addAttribute("sortField", sortField);
        model.addAttribute("sortDir", sortDir);

        return "admin/employees/list";
    }



    @GetMapping("/{id}")
    public String viewEmployee(@PathVariable("id") Integer id, Model model) {
        // In a real application, this would use employeeService.getEmployeeById(id)
        // For now, we'll use sample data

        Map<String, Object> employee = createSampleEmployee(id, "admin", "Admin User", "0912345678", "admin@shop.com", "active");
        employee.put("address", "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM");
        employee.put("startDate", LocalDate.now().minusYears(1));
        employee.put("dateOfBirth", LocalDate.now().minusYears(30));
        employee.put("roles", List.of("ADMIN", "MANAGER"));

        model.addAttribute("employee", employee);

        // Sample performance data
        Map<String, Object> performance = new HashMap<>();
        performance.put("processedOrdersCount", 156);
        performance.put("inventoryOperationsCount", 78);
        performance.put("performanceScore", 92);

        model.addAttribute("performance", performance);

        return "admin/employees/detail";
    }

    @Transactional
    @PostMapping("/add")
    public String addEmployee(@ModelAttribute EmployeeAdminDisplayDTO dto, RedirectAttributes redirectAttributes) {
        try {
            System.out.println("Adding employee: " + dto);
            EmployeeDTO employee = employeeService.addEmployee(dto);
            employeeRoleService.addEmployeeRole(employee.getEmployeeId(), dto.getRole());
            redirectAttributes.addFlashAttribute("success", "Thêm nhân viên thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Lỗi khi thêm nhân viên: " + e.getMessage());
        }
        return "redirect:/admin/employees";
    }

    @Transactional
    @PostMapping("/delete")
    public String deleteEmployee(@RequestParam("id") Integer id, RedirectAttributes redirectAttributes) {
        try {
            employeeService.deleteEmployee(id);
            employeeRoleService.deleteEmployeeRoleByEmployeeId(id);
            redirectAttributes.addFlashAttribute("success", "Xóa nhân viên thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Lỗi khi xóa nhân viên: " + e.getMessage());
        }
        return "redirect:/admin/employees";
    }

    private Map<String, Object> createSampleEmployee(int id, String username, String fullName, String phone, String email, String status) {
        Map<String, Object> employee = new HashMap<>();
        employee.put("id", id);
        employee.put("username", username);
        employee.put("fullName", fullName);
        employee.put("phoneNumber", phone);
        employee.put("email", email);
        employee.put("status", status);
        return employee;
    }
}
