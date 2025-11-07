package com.taskflow.project.service;

import com.taskflow.auth.model.User;
import com.taskflow.project.model.Project;

import java.util.List;

public interface ProjectService {
    Project createProject(Project project, User currentUser);
    List<Project> getAllProjects(Long userId);
    Project getProjectById(Long id);
    Project updateProject(Long id, Project project, User currentUser);
    void deleteProject(Long id);
    Project addTeamMember(Long projectId, Long userId);
    Project removeTeamMember(Long projectId, Long userId);
}
