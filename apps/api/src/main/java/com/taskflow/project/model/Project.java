package com.taskflow.project.model;

import com.taskflow.auth.model.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @ManyToOne
    private User owner;
}
