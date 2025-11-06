package com.taskflow.comment.service;

import com.taskflow.comment.model.Comment;
import com.taskflow.task.model.Task;
import com.taskflow.task.repository.TaskRepository;
import com.taskflow.comment.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;

    public CommentServiceImpl(CommentRepository commentRepository, TaskRepository taskRepository) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public Comment addCommentToTask(Long taskId, Comment comment) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        comment.setTask(task);
        comment.setCreatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);

        if (task.getAssignee() != null) {
            System.out.println("Notification: Task '" + task.getTitle() + "' assigned to '" + task.getAssignee().getUsername() + "' has a new comment from '" + comment.getAuthor().getUsername() + "'.");
        }

        return savedComment;
    }
}
