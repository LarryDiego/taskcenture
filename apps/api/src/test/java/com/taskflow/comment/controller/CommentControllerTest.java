package com.taskflow.comment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.comment.model.Comment;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    private Task task;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
        task = new Task();
        task.setTitle("Test Task");
        taskRepository.save(task);
    }

    @Test
    @WithMockUser
    void addCommentToTask() throws Exception {
        Comment comment = new Comment();
        comment.setContent("Test Comment");

        mockMvc.perform(post("/api/tasks/" + task.getId() + "/comments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(comment)))
                .andExpect(status().isOk());
    }
}
