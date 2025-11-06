package com.taskflow.report.service;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import com.taskflow.task.model.Task;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @InjectMocks
    private ReportServiceImpl reportService;

    @Test
    void generateCsvReport() {
        Task task1 = new Task();
        task1.setId(1L);
        task1.setTitle("Task 1");
        task1.setDescription("Description 1");
        task1.setPriority(Task.Priority.LOW);
        task1.setStatus(Task.Status.TO_DO);
        task1.setDueDate(LocalDate.now());

        List<Task> tasks = Arrays.asList(task1);

        ByteArrayInputStream bis = reportService.generateCsvReport(tasks);
        assertNotNull(bis);
        assertTrue(bis.available() > 0);
    }

    @Test
    void generatePdfReport() {
        Task task1 = new Task();
        task1.setId(1L);
        task1.setTitle("Task 1");
        task1.setDescription("Description 1");
        task1.setPriority(Task.Priority.LOW);
        task1.setStatus(Task.Status.TO_DO);
        task1.setDueDate(LocalDate.now());

        List<Task> tasks = Arrays.asList(task1);

        ByteArrayInputStream bis = reportService.generatePdfReport(tasks);
        assertNotNull(bis);
        assertTrue(bis.available() > 0);
    }
}
