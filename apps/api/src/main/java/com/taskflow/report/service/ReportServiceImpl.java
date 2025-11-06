package com.taskflow.report.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;
import com.taskflow.task.model.Task;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    @Override
    public ByteArrayInputStream generateCsvReport(List<Task> tasks) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             CSVWriter writer = new CSVWriter(new OutputStreamWriter(out))) {

            String[] header = {"ID", "Title", "Description", "Assignee", "Priority", "Due Date", "Status"};
            writer.writeNext(header);

            for (Task task : tasks) {
                writer.writeNext(new String[]{
                        String.valueOf(task.getId()),
                        task.getTitle(),
                        task.getDescription(),
                        task.getAssignee() != null ? task.getAssignee().getUsername() : "N/A",
                        task.getPriority().name(),
                        task.getDueDate() != null ? task.getDueDate().toString() : "N/A",
                        task.getStatus().name()
                });
            }

            writer.flush();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate CSV report: " + e.getMessage());
        }
    }

    @Override
    public ByteArrayInputStream generatePdfReport(List<Task> tasks) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            font.setSize(18);
            Paragraph p = new Paragraph("Task Report", font);
            p.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(p);

            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1f, 3f, 3f, 2f, 1.5f, 2f, 1.5f});

            String[] headers = {"ID", "Title", "Description", "Assignee", "Priority", "Due Date", "Status"};
            for (String header : headers) {
                PdfPCell headerCell = new PdfPCell();
                headerCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                headerCell.setPadding(5);
                headerCell.addElement(new Phrase(header));
                table.addCell(headerCell);
            }

            for (Task task : tasks) {
                table.addCell(String.valueOf(task.getId()));
                table.addCell(task.getTitle());
                table.addCell(task.getDescription());
                table.addCell(task.getAssignee() != null ? task.getAssignee().getUsername() : "N/A");
                table.addCell(task.getPriority().name());
                table.addCell(task.getDueDate() != null ? task.getDueDate().toString() : "N/A");
                table.addCell(task.getStatus().name());
            }

            document.add(table);
            document.close();

            return new ByteArrayInputStream(out.toByteArray());
        } catch (DocumentException e) {
            throw new RuntimeException("Failed to generate PDF report: " + e.getMessage());
        }
    }

    @Override
    public String uploadReportToS3(ByteArrayInputStream bis, String filename) {
        // Simulate S3 upload
        System.out.println("Simulating upload of " + filename + " to S3.");
        return "https://s3.amazonaws.com/taskflow-reports/" + filename;
    }
}
