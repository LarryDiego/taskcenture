package com.taskflow.task.service;

import com.taskflow.task.model.Task;

import java.util.List;

public interface TaskService {
    Task createTask(Long projectId, Task task);
    List<Task> getTasksByProjectId(Long projectId);
    Task getTaskById(Long id);
    Task updateTask(Long id, Task task);
    void deleteTask(Long id);
}
