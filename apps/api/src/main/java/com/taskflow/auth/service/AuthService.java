package com.taskflow.auth.service;

import com.taskflow.auth.model.User;

public interface AuthService {
    User register(User user);
    String login(String email, String password);
    User getUserByEmail(String email);
}
