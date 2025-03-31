package com.example.service;

import com.example.model.Task;
import com.example.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
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

}