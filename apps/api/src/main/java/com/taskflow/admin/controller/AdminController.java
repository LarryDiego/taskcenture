package com.taskflow.admin.controller;

import com.taskflow.admin.service.AdminService;
import com.taskflow.auth.model.User;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMINISTRATOR')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PutMapping("/{userId}/role")
    public User updateUserRole(@PathVariable Long userId, @RequestBody Map<String, String> payload) {
        String newRole = payload.get("role");
        return adminService.updateUserRole(userId, newRole);
    }

    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
    }
}
