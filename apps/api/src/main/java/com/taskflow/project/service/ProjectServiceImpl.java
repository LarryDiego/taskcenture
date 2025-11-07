package com.taskflow.project.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskflow.auth.model.User;
import com.taskflow.auth.repository.UserRepository;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.notification.service.NotificationService;
import com.taskflow.project.model.Project;
import com.taskflow.project.repository.ProjectRepository;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ProjectServiceImpl(ProjectRepository projectRepository, UserRepository userRepository, NotificationService notificationService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public Project createProject(Project project, User currentUser) {
        // Ensure the owner is always in the team members
        if (project.getOwner() != null && !project.getTeamMembers().contains(project.getOwner())) {
            project.getTeamMembers().add(project.getOwner());
        }
        
        // Save the project first
        Project savedProject = projectRepository.save(project);
        
        // Send notifications to all team members except the owner
        for (User member : savedProject.getTeamMembers()) {
            if (!member.getId().equals(savedProject.getOwner().getId())) {
                notificationService.notifyUserAddedToProject(member, savedProject, currentUser);
            }
        }
        
        return savedProject;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> getAllProjects(Long userId) {
        List<Project> allProjects = projectRepository.findAll();
        // Filter projects where user is owner or team member
        return allProjects.stream()
            .filter(project -> 
                (project.getOwner() != null && project.getOwner().getId().equals(userId)) ||
                project.getTeamMembers().stream().anyMatch(member -> member.getId().equals(userId))
            )
            .collect(Collectors.toList());
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
    }

    @Override
    @Transactional
    public Project updateProject(Long id, Project project, User currentUser) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        
        existingProject.setName(project.getName());
        existingProject.setDescription(project.getDescription());
        
        // Track previous team members to identify newly added ones
        Set<Long> previousMemberIds = existingProject.getTeamMembers().stream()
                .map(User::getId)
                .collect(Collectors.toSet());
        
        // Update team members if provided
        if (project.getTeamMembers() != null) {
            // Clear existing team members
            existingProject.getTeamMembers().clear();
            
            // Add new team members
            for (User member : project.getTeamMembers()) {
                User user = userRepository.findById(member.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("User", "id", member.getId()));
                existingProject.getTeamMembers().add(user);
            }
            
            // Always ensure the owner is in the team members if owner exists
            if (existingProject.getOwner() != null && 
                !existingProject.getTeamMembers().contains(existingProject.getOwner())) {
                existingProject.getTeamMembers().add(existingProject.getOwner());
            }
        }
        
        Project savedProject = projectRepository.save(existingProject);
        // Force a flush to ensure changes are persisted
        projectRepository.flush();
        
        // Send notifications to newly added team members
        for (User member : savedProject.getTeamMembers()) {
            if (!previousMemberIds.contains(member.getId()) && 
                !member.getId().equals(savedProject.getOwner().getId())) {
                notificationService.notifyUserAddedToProject(member, savedProject, currentUser);
            }
        }
        
        return savedProject;
    }

    @Override
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project", "id", id);
        }
        projectRepository.deleteById(id);
    }

    @Override
    public Project addTeamMember(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        if (!project.getTeamMembers().contains(user)) {
            project.getTeamMembers().add(user);
            return projectRepository.save(project);
        }
        return project;
    }

    @Override
    public Project removeTeamMember(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        project.getTeamMembers().remove(user);
        return projectRepository.save(project);
    }
}
