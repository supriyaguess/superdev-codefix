package com.internal.tasktracker;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        String status,
        String priority,
        String assignee,
        LocalDateTime createdAt,
        LocalDate dueDate) {

    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getAssignee(),
                task.getCreatedAt(),
                task.getDueDate());
    }
}
