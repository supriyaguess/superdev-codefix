package com.internal.tasktracker;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query(value = "SELECT * FROM tasks WHERE archived = FALSE "
                 + "AND (:term IS NULL OR LOWER(title) LIKE :term ESCAPE '\\' OR LOWER(description) LIKE :term ESCAPE '\\') "
                 + "AND (:status IS NULL OR status = :status) "
                 + "AND (:assignee IS NULL OR assignee = :assignee) "
                 + "ORDER BY created_at ASC, id ASC",
           countQuery = "SELECT COUNT(*) FROM tasks WHERE archived = FALSE "
                      + "AND (:term IS NULL OR LOWER(title) LIKE :term ESCAPE '\\' OR LOWER(description) LIKE :term ESCAPE '\\') "
                      + "AND (:status IS NULL OR status = :status) "
                      + "AND (:assignee IS NULL OR assignee = :assignee)",
           nativeQuery = true)
    Page<Task> searchTasks(@Param("term") String term, @Param("status") String status,
                            @Param("assignee") String assignee, Pageable pageable);

    @Query(value = "SELECT DISTINCT assignee FROM tasks WHERE archived = FALSE AND assignee IS NOT NULL ORDER BY assignee",
           nativeQuery = true)
    List<String> findAssignees();
}
