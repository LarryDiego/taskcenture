package com.taskflow.task.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.project.model.Project;
import com.taskflow.project.repository.ProjectRepository;
import com.taskflow.task.model.Task;
import com.taskflow.task.repository.TaskRepository;
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
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    private Project project;

    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
        taskRepository.deleteAll();
        project = new Project();
        project.setName("Test Project");
        project.setDescription("Test Description");
        projectRepository.save(project);
    }

    @Test
    @WithMockUser
    void createTask() throws Exception {
        Task task = new Task();
        task.setTitle("Test Task");
        task.setStatus(Task.Status.TO_DO);

        mockMvc.perform(post("/api/projects/" + project.getId() + "/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Task"));
    }

    @Test
    @WithMockUser
    void updateTaskStatus() throws Exception {
        Task task = new Task();
        task.setTitle("Test Task");
        task.setStatus(Task.Status.TO_DO);
        task.setProject(project);
        taskRepository.save(task);

        task.setStatus(Task.Status.DONE);

        mockMvc.perform(put("/api/projects/" + project.getId() + "/tasks/" + task.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DONE"));
    }
}
