package com.taskflow.comment.service;

import com.taskflow.auth.model.User;
import com.taskflow.comment.model.Comment;
import com.taskflow.comment.repository.CommentRepository;
import com.taskflow.task.model.Task;
import com.taskflow.task.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private CommentServiceImpl commentService;

    @Test
    void addCommentToTask() {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        User assignee = new User();
        assignee.setUsername("assignee");
        task.setAssignee(assignee);

        Comment comment = new Comment();
        comment.setContent("Test Comment");
        User author = new User();
        author.setUsername("author");
        comment.setAuthor(author);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(commentRepository.save(comment)).thenReturn(comment);

        commentService.addCommentToTask(1L, comment);

        verify(commentRepository).save(comment);
    }
}
