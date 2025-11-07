package com.taskflow.auth.service;

import com.taskflow.auth.model.User;
import com.taskflow.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void register() {
        User user = new User();
        user.setEmail("test@test.com");
        user.setPassword("password");
        user.setUsername("testuser");

        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userRepository.save(user)).thenReturn(user);

        User result = authService.register(user);

        assertEquals("encodedPassword", result.getPassword());
        assertEquals("COLLABORATOR", result.getRole());
        verify(userRepository).save(user);
    }
}