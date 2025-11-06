package com.taskflow.comment.controller;

import com.taskflow.comment.model.Comment;
import com.taskflow.comment.service.CommentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public Comment addCommentToTask(@PathVariable Long taskId, @RequestBody Comment comment) {
        return commentService.addCommentToTask(taskId, comment);
    }
}
