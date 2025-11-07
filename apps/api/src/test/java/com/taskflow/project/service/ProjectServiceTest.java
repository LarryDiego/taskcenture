package com.taskflow.project.service;

import com.taskflow.auth.model.User;
import com.taskflow.project.model.Project;
import com.taskflow.project.repository.ProjectRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    @Test
    void createProject() {
        Project project = new Project();
        User user = new User();

        project.setName("Test Project");

        when(projectRepository.save(project)).thenReturn(project);

        projectService.createProject(project, user);

        verify(projectRepository).save(project);
    }

    @Test
    void getProjectById() {
        Project project = new Project();
        project.setId(1L);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        projectService.getProjectById(1L);

        verify(projectRepository).findById(1L);
    }

    @Test
    void deleteProject() {
        when(projectRepository.existsById(1L)).thenReturn(true);

        projectService.deleteProject(1L);

        verify(projectRepository).deleteById(1L);
    }
}
