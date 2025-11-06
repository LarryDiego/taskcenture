package com.taskflow.admin.controller;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.auth.model.User;
import com.taskflow.auth.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private User adminUser;
    private User regularUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@test.com");
        adminUser.setPassword("password");
        adminUser.setRole("ADMINISTRATOR");
        userRepository.save(adminUser);

        regularUser = new User();
        regularUser.setUsername("user");
        regularUser.setEmail("user@test.com");
        regularUser.setPassword("password");
        regularUser.setRole("COLLABORATOR");
        userRepository.save(regularUser);
    }

    @Test
    @WithMockUser(roles = "ADMINISTRATOR")
    void getAllUsersAsAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void getAllUsersAsManager() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMINISTRATOR")
    void updateUserRoleAsAdmin() throws Exception {
        mockMvc.perform(put("/api/admin/users/" + regularUser.getId() + "/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("role", "MANAGER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("MANAGER"));
    }

    @Test
    @WithMockUser(roles = "ADMINISTRATOR")
    void deleteUserAsAdmin() throws Exception {
        mockMvc.perform(delete("/api/admin/users/" + regularUser.getId()))
                .andExpect(status().isOk());
    }
}
