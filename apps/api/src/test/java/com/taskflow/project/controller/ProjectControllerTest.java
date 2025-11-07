package com.taskflow.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.auth.model.User;
import com.taskflow.auth.repository.UserRepository;
import com.taskflow.project.model.Project;
import com.taskflow.project.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void createProjectWithManagerRole() throws Exception {
        Project project = new Project();
        project.setName("Test Project");
        project.setDescription("Test Description");

        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(project)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Project"));
    }

    @Test
    @WithMockUser(roles = "COLLABORATOR")
    void createProjectWithCollaboratorRole() throws Exception {
        Project project = new Project();
        project.setName("Test Project");
        project.setDescription("Test Description");

        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(project)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = "COLLABORATOR")
    void getAllProjects() throws Exception {
        User user = new User();
        user.setEmail("user@test.com");
        user.setPassword("password");
        user.setUsername("testuser");
        userRepository.save(user);

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "COLLABORATOR")
    void getProjectById() throws Exception {
        Project project = new Project();
        project.setName("Test Project");
        project.setDescription("Test Description");
        projectRepository.save(project);

        mockMvc.perform(get("/api/projects/" + project.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Project"));
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void updateProject() throws Exception {
        Project project = new Project();
        project.setName("Test Project");
        project.setDescription("Test Description");
        projectRepository.save(project);

        project.setName("Updated Project");

        mockMvc.perform(put("/api/projects/" + project.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(project)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Project"));
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void deleteProject() throws Exception {
        Project project = new Project();
        project.setName("Test Project");
        project.setDescription("Test Description");
        projectRepository.save(project);

        mockMvc.perform(delete("/api/projects/" + project.getId()))
                .andExpect(status().isOk());
    }
}
