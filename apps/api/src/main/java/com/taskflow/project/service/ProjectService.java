package com.taskflow.project.service;

import com.taskflow.project.model.Project;

import java.util.List;

public interface ProjectService {
    Project createProject(Project project);
    List<Project> getAllProjects(Long userId);
    Project getProjectById(Long id);
    Project updateProject(Long id, Project project);
    void deleteProject(Long id);
    Project addTeamMember(Long projectId, Long userId);
    Project removeTeamMember(Long projectId, Long userId);
}
