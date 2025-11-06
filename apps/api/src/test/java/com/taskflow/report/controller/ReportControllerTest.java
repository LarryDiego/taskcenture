package com.taskflow.report.controller;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.taskflow.project.model.Project;
import com.taskflow.project.repository.ProjectRepository;
import com.taskflow.task.model.Task;
import com.taskflow.task.repository.TaskRepository;

@SpringBootTest
@AutoConfigureMockMvc
class ReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

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
        projectRepository.save(project);

        Task task = new Task();
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setPriority(Task.Priority.LOW);
        task.setStatus(Task.Status.TO_DO);
        task.setDueDate(LocalDate.now());
        task.setProject(project);
        taskRepository.save(task);
    }

    @Test
    @WithMockUser
    void exportCsvReport() throws Exception {
        mockMvc.perform(get("/api/projects/" + project.getId() + "/export?format=csv"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void exportPdfReport() throws Exception {
        mockMvc.perform(get("/api/projects/" + project.getId() + "/export?format=pdf"))
                .andExpect(status().isOk());
    }
}
