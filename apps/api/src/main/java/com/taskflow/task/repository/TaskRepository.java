package com.taskflow.task.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.taskflow.task.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    
    @Modifying
    @Query("UPDATE Task t SET t.assignee = null WHERE t.assignee.id = :userId")
    void unassignTasksFromUser(@Param("userId") Long userId);
}
