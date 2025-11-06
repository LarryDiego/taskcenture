package com.taskflow.admin.service;

import com.taskflow.auth.model.User;

import java.util.List;

public interface AdminService {
    List<User> getAllUsers();
    User updateUserRole(Long userId, String newRole);
    void deleteUser(Long userId);
}
