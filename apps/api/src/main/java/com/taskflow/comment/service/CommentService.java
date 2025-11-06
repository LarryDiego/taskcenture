package com.taskflow.comment.service;

import com.taskflow.comment.model.Comment;

public interface CommentService {
    Comment addCommentToTask(Long taskId, Comment comment);
}
