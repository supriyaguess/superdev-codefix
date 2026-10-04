package com.internal.tasktracker;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    String FILTERS = "WHERE archived = FALSE "
            + "AND (:term IS NULL OR LOWER(title) LIKE :term ESCAPE '\\' OR LOWER(description) LIKE :term ESCAPE '\\') "
            + "AND (:status IS NULL OR status = :status) "
            + "AND (:assignee IS NULL OR assignee = :assignee) "
            + "AND (:priority IS NULL OR priority = :priority) "
            + "AND (CAST(:createdFrom AS TIMESTAMP) IS NULL OR created_at >= :createdFrom) "
            + "AND (CAST(:createdTo AS TIMESTAMP) IS NULL OR created_at < :createdTo) "
            + "AND (:due IS NULL OR (status <> 'DONE' AND ("
            + "(:due = 'overdue' AND due_date < CURRENT_DATE) "
            + "OR (:due = 'soon' AND due_date BETWEEN CURRENT_DATE AND DATEADD('DAY', 7, CURRENT_DATE))))) ";

    String SORT = "ORDER BY "
            + "CASE WHEN :sort = 'created_desc' THEN created_at END DESC, "
            + "CASE WHEN :sort = 'due_asc' THEN due_date END ASC, "
            + "CASE WHEN :sort = 'priority' THEN CASE priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END END ASC, "
            + "created_at ASC, id ASC";

    @Query(value = "SELECT * FROM tasks " + FILTERS + SORT,
           countQuery = "SELECT COUNT(*) FROM tasks " + FILTERS,
           nativeQuery = true)
    Page<Task> searchTasks(@Param("term") String term,
                           @Param("status") String status,
                           @Param("assignee") String assignee,
                           @Param("priority") String priority,
                           @Param("createdFrom") LocalDateTime createdFrom,
                           @Param("createdTo") LocalDateTime createdTo,
                           @Param("due") String due,
                           @Param("sort") String sort,
                           Pageable pageable);

    @Query(value = "SELECT DISTINCT assignee FROM tasks WHERE archived = FALSE AND assignee IS NOT NULL ORDER BY assignee",
           nativeQuery = true)
    List<String> findAssignees();

    @Query(value = "SELECT COUNT(*) AS total, "
            + "COALESCE(SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END), 0) AS openCount, "
            + "COALESCE(SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END), 0) AS inProgressCount, "
            + "COALESCE(SUM(CASE WHEN status = 'DONE' THEN 1 ELSE 0 END), 0) AS doneCount, "
            + "COALESCE(SUM(CASE WHEN status <> 'DONE' AND priority = 'HIGH' THEN 1 ELSE 0 END), 0) AS highPending, "
            + "COALESCE(SUM(CASE WHEN status <> 'DONE' AND due_date < CURRENT_DATE THEN 1 ELSE 0 END), 0) AS overdue "
            + "FROM tasks WHERE archived = FALSE AND (:assignee IS NULL OR assignee = :assignee)",
           nativeQuery = true)
    TaskSummary summarize(@Param("assignee") String assignee);

    @Query(value = "SELECT assignee, COUNT(*) AS total, "
            + "COALESCE(SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END), 0) AS openCount, "
            + "COALESCE(SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END), 0) AS inProgressCount, "
            + "COALESCE(SUM(CASE WHEN status = 'DONE' THEN 1 ELSE 0 END), 0) AS doneCount, "
            + "COALESCE(SUM(CASE WHEN status <> 'DONE' AND due_date < CURRENT_DATE THEN 1 ELSE 0 END), 0) AS overdue "
            + "FROM tasks WHERE archived = FALSE AND assignee IS NOT NULL GROUP BY assignee ORDER BY assignee",
           nativeQuery = true)
    List<AssigneeSummary> summarizeByAssignee();
}
