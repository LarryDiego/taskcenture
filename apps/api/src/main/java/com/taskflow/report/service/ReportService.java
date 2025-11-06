package com.taskflow.report.service;

import com.taskflow.project.model.Project;
import com.taskflow.task.model.Task;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface ReportService {
    ByteArrayInputStream generateCsvReport(List<Task> tasks);
    ByteArrayInputStream generatePdfReport(List<Task> tasks);
    String uploadReportToS3(ByteArrayInputStream bis, String filename);
}
