-- H2-compatible task search query
-- Used by the Spring Data repository layer
--
-- Parameters:
--   :term   — search term wrapped in wildcards, e.g. '%api%'
--   :status — status filter or NULL for all statuses
--   :assignee — assignee filter or NULL for all assignees

SELECT *
FROM tasks
WHERE archived = FALSE
  AND (LOWER(title) LIKE :term OR LOWER(description) LIKE :term)
  AND (:status IS NULL OR status = :status)
  AND (:assignee IS NULL OR assignee = :assignee)
ORDER BY created_at ASC, id ASC;
