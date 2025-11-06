package com.taskflow.admin.service;

import com.taskflow.auth.model.User;
import com.taskflow.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    @Test
    void getAllUsers() {
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("user1");
        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("user2");
        List<User> users = Arrays.asList(user1, user2);

        when(userRepository.findAll()).thenReturn(users);

        List<User> result = adminService.getAllUsers();

        assertEquals(2, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void updateUserRole() {
        User user = new User();
        user.setId(1L);
        user.setRole("COLLABORATOR");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        User result = adminService.updateUserRole(1L, "MANAGER");

        assertEquals("MANAGER", result.getRole());
        verify(userRepository).findById(1L);
        verify(userRepository).save(user);
    }

    @Test
    void deleteUser() {
        adminService.deleteUser(1L);

        verify(userRepository).deleteById(1L);
    }
}
