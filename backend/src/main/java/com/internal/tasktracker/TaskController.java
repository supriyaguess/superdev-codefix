package com.internal.tasktracker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private static final Logger log = LoggerFactory.getLogger(TaskController.class);
    private static final int MAX_PAGE_SIZE = 100;
    private static final Set<String> PRIORITIES = Set.of("HIGH", "MEDIUM", "LOW");
    private static final Set<String> DUE_FILTERS = Set.of("overdue", "soon");
    private static final Set<String> SORTS = Set.of("created_asc", "created_desc", "due_asc", "priority");

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping("/api/tasks")
    public ResponseEntity<Map<String, Object>> searchTasks(
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assignee,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdTo,
            @RequestParam(required = false) String due,
            @RequestParam(required = false, defaultValue = "created_asc") String sort,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize) {

        String query = q.trim();
        String searchTerm = query.isEmpty() ? null : "%" + escapeLike(query.toLowerCase()) + "%";
        String normalizedStatus = parseEnum(status, "status", TaskStatus.names());
        String normalizedPriority = parseEnum(priority, "priority", PRIORITIES);
        String normalizedAssignee = blankToNull(assignee);
        String normalizedDue = due == null || due.isBlank() ? null : due.trim().toLowerCase();
        if (normalizedDue != null && !DUE_FILTERS.contains(normalizedDue)) {
            throw new IllegalArgumentException("Invalid due filter: " + due);
        }
        if (!SORTS.contains(sort)) {
            throw new IllegalArgumentException("Invalid sort: " + sort);
        }

        page = Math.max(page, 1);
        pageSize = Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE);

        log.info("q=\"{}\" status={} assignee={} priority={} due={} sort={} page={} pageSize={}",
                query, normalizedStatus, normalizedAssignee, normalizedPriority, normalizedDue, sort, page, pageSize);

        Page<Task> result = taskRepository.searchTasks(
                searchTerm,
                normalizedStatus,
                normalizedAssignee,
                normalizedPriority,
                createdFrom == null ? null : createdFrom.atStartOfDay(),
                createdTo == null ? null : createdTo.plusDays(1).atStartOfDay(),
                normalizedDue,
                sort,
                PageRequest.of(page - 1, pageSize));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("items", result.getContent().stream().map(TaskResponse::from).toList());
        response.put("total", result.getTotalElements());
        response.put("page", page);
        response.put("pageSize", pageSize);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/assignees")
    public List<String> assignees() {
        return taskRepository.findAssignees();
    }

    @GetMapping("/api/summary")
    public Map<String, Long> summary(@RequestParam(required = false) String assignee) {
        TaskSummary summary = taskRepository.summarize(blankToNull(assignee));

        Map<String, Long> response = new LinkedHashMap<>();
        response.put("total", summary.getTotal());
        response.put("open", summary.getOpenCount());
        response.put("inProgress", summary.getInProgressCount());
        response.put("done", summary.getDoneCount());
        response.put("highPending", summary.getHighPending());
        response.put("overdue", summary.getOverdue());
        return response;
    }

    @GetMapping("/api/summary/assignees")
    public List<Map<String, Object>> assigneeSummary() {
        return taskRepository.summarizeByAssignee().stream().map(row -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("assignee", row.getAssignee());
            item.put("total", row.getTotal());
            item.put("open", row.getOpenCount());
            item.put("inProgress", row.getInProgressCount());
            item.put("done", row.getDoneCount());
            item.put("overdue", row.getOverdue());
            return item;
        }).toList();
    }

    private static String parseEnum(String value, String name, Set<String> allowed) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String normalized = value.trim().toUpperCase();
        if (!allowed.contains(normalized)) {
            throw new IllegalArgumentException("Invalid " + name + ": " + value);
        }
        return normalized;
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private static String escapeLike(String value) {
        return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}
