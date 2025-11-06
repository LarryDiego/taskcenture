package com.taskflow.task.service;

import com.taskflow.project.model.Project;
import com.taskflow.project.repository.ProjectRepository;
import com.taskflow.task.model.Task;
import com.taskflow.task.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    @Test
    void createTask() {
        Project project = new Project();
        project.setId(1L);

        Task task = new Task();
        task.setTitle("Test Task");

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(taskRepository.save(task)).thenReturn(task);

        taskService.createTask(1L, task);

        verify(taskRepository).save(task);
    }

    @Test
    void getTaskById() {
        Task task = new Task();
        task.setId(1L);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        taskService.getTaskById(1L);

        verify(taskRepository).findById(1L);
    }

    @Test
    void deleteTask() {
        taskService.deleteTask(1L);

        verify(taskRepository).deleteById(1L);
    }
}
