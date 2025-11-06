package com.taskflow.report.controller;

import com.taskflow.report.service.ReportService;
import com.taskflow.task.model.Task;
import com.taskflow.task.service.TaskService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/export")
public class ReportController {

    private final ReportService reportService;
    private final TaskService taskService;

    public ReportController(ReportService reportService, TaskService taskService) {
        this.reportService = reportService;
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<InputStreamResource> exportReport(@PathVariable Long projectId, @RequestParam String format) {
        List<Task> tasks = taskService.getTasksByProjectId(projectId);

        ByteArrayInputStream bis;
        String filename;
        MediaType mediaType;

        if ("csv".equalsIgnoreCase(format)) {
            bis = reportService.generateCsvReport(tasks);
            filename = "tasks.csv";
            mediaType = MediaType.parseMediaType("application/csv");
        } else if ("pdf".equalsIgnoreCase(format)) {
            bis = reportService.generatePdfReport(tasks);
            filename = "tasks.pdf";
            mediaType = MediaType.parseMediaType("application/pdf");
        } else {
            return ResponseEntity.badRequest().build();
        }

        String s3Url = reportService.uploadReportToS3(bis, filename);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + filename)
                .contentType(mediaType)
                .body(new InputStreamResource(bis));
    }
}
