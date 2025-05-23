package com.example.service;

import com.example.model.Task;
import com.example.model.User;
import com.example.repository.TaskRepository;
import com.example.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDateTime;
import java.util.List;

@Service
@EnableScheduling
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    @Autowired
    public TaskService(TaskRepository taskRepository, UserRepository userRepository, JavaMailSender mailSender) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    public Task createTask(Task task) {
        System.out.println("Saving task to database: " + task);
        Task savedTask = taskRepository.save(task);
        System.out.println("Task saved successfully with ID: " + savedTask.getId());
        return savedTask;
    }

    public Task updateTask(String id, Task updatedTask) {
        System.out.println("Updating task with ID: " + id);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (updatedTask.getTitle() != null) {
            task.setTitle(updatedTask.getTitle());
        }
        if (updatedTask.getDueDate() != null) {
            task.setDueDate(updatedTask.getDueDate());
        }
        if (updatedTask.getPriority() != null) {
            task.setPriority(updatedTask.getPriority());
        }
        if (updatedTask.getReminderTime() != null) {
            task.setReminderTime(updatedTask.getReminderTime());
        }
        task.setCompleted(updatedTask.isCompleted());
        Task updated = taskRepository.save(task);
        System.out.println("Task updated successfully: " + updated);
        return updated;
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }

    public List<Task> getTasksByUserAndPriority(String userId, String priority) {
        return taskRepository.findByUserIdAndPriority(userId, priority);
    }

    public List<Task> getTasksByUserId(String userId) {
        return taskRepository.findByUserId(userId);
    }

    public List<Task> getHighPriorityTasks(String userId) {
        return taskRepository.findByUserIdAndPriority(userId, "HIGH");
    }

    @Scheduled(fixedRate = 60000)
    public void checkReminders() {
        System.out.println("Running checkReminders at: " + LocalDateTime.now());
        LocalDateTime now = LocalDateTime.now();
        List<Task> tasks = taskRepository.findAll();
        System.out.println("Found " + tasks.size() + " tasks");
        for (Task task : tasks) {
            if (task.getReminderTime() == null) {
                System.out.println("Task " + task.getId() + " has no reminderTime");
                continue;
            }
            if (task.isCompleted()) {
                System.out.println("Task " + task.getId() + " is completed");
                continue;
            }
            if (!task.getReminderTime().isBefore(now)) {
                System.out.println("Task " + task.getId() + " reminderTime not yet reached: " + task.getReminderTime());
                continue;
            }
            User user = userRepository.findById(task.getUserId()).orElse(null);
            if (user == null) {
                System.out.println("User not found for task " + task.getId() + ", userId: " + task.getUserId());
                continue;
            }
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                System.out.println("No email for user " + task.getUserId() + " in task " + task.getId());
                continue;
            }
            sendReminderEmail(task, user.getEmail());
            task.setReminderTime(null); // Prevent repeated emails
            taskRepository.save(task);
        }
    }

    private void sendReminderEmail(Task task, String email) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setSubject("Task Reminder: " + task.getTitle());
            helper.setText(String.format(
                "Dear User,\n\nThis is a reminder for your task: %s\nDue Date: %s\nPriority: %s\n\nPlease complete it soon!\n\nBest regards,\nZenAlert Team",
                task.getTitle(), task.getDueDate(), task.getPriority()
            ));
            mailSender.send(message);
            System.out.println("Reminder email sent for task: " + task.getId() + " to " + email);
        } catch (MessagingException e) {
            System.err.println("Failed to send reminder email for task: " + task.getId() + " to " + email + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}
