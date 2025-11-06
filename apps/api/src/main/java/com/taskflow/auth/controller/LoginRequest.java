package com.taskflow.auth.controller;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
