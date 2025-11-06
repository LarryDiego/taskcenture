package com.taskflow.project.service;

import com.taskflow.project.model.Project;
import com.taskflow.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    @Override
    public Project updateProject(Long id, Project project) {
        Project existingProject = getProjectById(id);
        if (existingProject != null) {
            existingProject.setName(project.getName());
            existingProject.setDescription(project.getDescription());
            return projectRepository.save(existingProject);
        }
        return null;
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
