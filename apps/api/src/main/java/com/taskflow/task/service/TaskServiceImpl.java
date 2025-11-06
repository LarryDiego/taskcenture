package com.taskflow.task.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.taskflow.auth.repository.UserRepository;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.project.model.Project;
import com.taskflow.project.repository.ProjectRepository;
import com.taskflow.task.model.Task;
import com.taskflow.task.repository.TaskRepository;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Task createTask(Long projectId, Task task) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        task.setProject(project);
        
        // If assignee is provided, fetch the full user from database
        if (task.getAssignee() != null && task.getAssignee().getId() != null) {
            var user = userRepository.findById(task.getAssignee().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", task.getAssignee().getId()));
            task.setAssignee(user);
        }
        
        return taskRepository.save(task);
    }

    @Override
    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
    }

    @Override
    public Task updateTask(Long id, Task task) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        
        // Only update fields that are provided (non-null)
        if (task.getTitle() != null) {
            existingTask.setTitle(task.getTitle());
        }
        if (task.getDescription() != null) {
            existingTask.setDescription(task.getDescription());
        }
        if (task.getPriority() != null) {
            existingTask.setPriority(task.getPriority());
        }
        if (task.getStatus() != null) {
            existingTask.setStatus(task.getStatus());
        }
        if (task.getDueDate() != null) {
            existingTask.setDueDate(task.getDueDate());
        }
        if (task.getAssignee() != null && task.getAssignee().getId() != null) {
            // Fetch the full user from database instead of using the partial object
            var user = userRepository.findById(task.getAssignee().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", task.getAssignee().getId()));
            existingTask.setAssignee(user);
        }
        return taskRepository.save(existingTask);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task", "id", id);
        }
        taskRepository.deleteById(id);
    }
}
