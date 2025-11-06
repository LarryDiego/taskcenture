package com.taskflow.comment.model;

import com.taskflow.auth.model.User;
import com.taskflow.task.model.Task;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    private User author;

    private LocalDateTime createdAt;

    @ManyToOne
    private Task task;
}
