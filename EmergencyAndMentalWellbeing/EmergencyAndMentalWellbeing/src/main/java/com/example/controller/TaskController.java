package com.example.controller;

import com.example.model.Task;
import com.example.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;
import jakarta.mail.internet.MimeMessage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final JavaMailSender mailSender;

    @Autowired
    public TaskController(TaskService taskService, JavaMailSender mailSender) {
        this.taskService = taskService;
        this.mailSender = mailSender;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createTask(@RequestBody Task task) {
        System.out.println("Received POST request to /api/tasks with body: " + task);
        Map<String, String> response = new HashMap<>();
        try {
            Task savedTask = taskService.createTask(task);
            response.put("message", "Task created successfully!");
            response.put("taskId", savedTask.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in createTask: " + e.getMessage());
            e.printStackTrace();
            response.put("message", "Failed to create task: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateTask(@PathVariable String id, @RequestBody Task task) {
        System.out.println("Received PUT request to /api/tasks/" + id + " with body: " + task);
        Map<String, String> response = new HashMap<>();
        try {
            Task updatedTask = taskService.updateTask(id, task);
            response.put("message", "Task updated successfully!");
            response.put("taskId", updatedTask.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in updateTask: " + e.getMessage());
            e.printStackTrace();
            response.put("message", "Failed to update task: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable String id) {
        Map<String, String> response = new HashMap<>();
        try {
            taskService.deleteTask(id);
            response.put("message", "Task deleted successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to delete task: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getTasksByUserId(@PathVariable String userId) {
        List<Task> tasks = taskService.getTasksByUserId(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}/priority/{priority}")
    public ResponseEntity<List<Task>> getTasksByPriority(@PathVariable String userId, @PathVariable String priority) {
        return ResponseEntity.ok(taskService.getTasksByUserAndPriority(userId, priority));
    }
    
    @GetMapping("/user/{userId}/high-priority")
    public ResponseEntity<List<Task>> getHighPriorityTasks(@PathVariable String userId) {
        List<Task> highPriorityTasks = taskService.getHighPriorityTasks(userId);
        return ResponseEntity.ok(highPriorityTasks);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralExceptions(Exception ex) {
        System.out.println("General error occurred: " + ex.getMessage());
        ex.printStackTrace();
        Map<String, String> response = new HashMap<>();
        response.put("message", "An unexpected error occurred: " + ex.getMessage());
        return ResponseEntity.status(500).body(response);
    }
    @GetMapping("/test-email")
    public ResponseEntity<Map<String, String>> testEmail() {
        Map<String, String> response = new HashMap<>();
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo("receiver mail id"); // Your email
            helper.setSubject("Test Email from ZenAlert");
            helper.setText("This is a test email to verify Gmail SMTP configuration.");
            mailSender.send(message);
            response.put("message", "Test email sent successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Failed to send test email: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
