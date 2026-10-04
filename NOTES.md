# NOTES

## Summary of changes
- **SQL precedence bug**: `AND ... OR ... AND` let archived tasks through and ignored the status filter on description matches. Added brackets in `TaskRepository.java`, `search_tasks.sql` and the Oracle package.
- **Artificial delay**: removed the `Thread.sleep` in `TaskController`.
- **Pagination and ordering**: DB-level `LIMIT/OFFSET` via `Pageable` instead of in-memory `subList`, with a selectable sort.
- **Query optimisation**: blank search skips `LIKE`, `%` and `_` are escaped, added indexes.
- **Input handling**: bad `status`, `priority`, `sort` or date values return 400 through a `@RestControllerAdvice`. `pageSize` is clamped to 1-100.
- **Backend cleanup**: SLF4J instead of `System.out`, `show-sql` and `open-in-view` off, `TaskResponse` DTO.
- **useTasks hook**: debounce, stale response handling, `error` reset, `loading` cleared in `finally`.
- **Board layout**: one section per status, each with its own paginated request, so the three requests run in parallel.
- **New filters**: assignee, priority, due (overdue / this week), created date range and sort, with removable chips.
- **Due dates**: added a `due_date` column, seeded relative to today, with overdue and due-soon badges.
- **Summary**: `/api/summary` and `/api/summary/assignees` feed the top counters and an assignee-wise table.
- **UI**: restyled, search highlighting, skeleton cards.

## What I chose not to change
- Hardcoded CORS origin and enabled H2 console, as both are local-only.
- The Oracle package and reference SQL do not have the new filters.

## Biggest remaining risk
`LIKE '%term%'` on `LOWER(title)` and `LOWER(description)` cannot use a normal index, so search becomes a full scan as the table grows.

## Tools / AI used
- Claude Code to find issues and draft fixes and UI. I reviewed each change and tested the API with curl.

## Assumptions
- Archived tasks never appear in results.
- Seeded due dates are demo data, as the original schema had none.
