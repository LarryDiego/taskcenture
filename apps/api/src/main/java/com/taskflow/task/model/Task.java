package com.taskflow.task.model;

import com.taskflow.auth.model.User;
import com.taskflow.comment.model.Comment;
import com.taskflow.project.model.Project;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDate dueDate;

    @ManyToOne
    private User assignee;

    @ManyToOne
    private Project project;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<Comment> comments;

    public enum Priority {
        LOW, MEDIUM, HIGH
    }

    public enum Status {
        TO_DO, IN_PROGRESS, DONE
    }
}
