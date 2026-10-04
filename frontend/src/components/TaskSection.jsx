import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { formatDate, getDueInfo } from '../utils/dates';
import Highlight from './Highlight';

const PAGE_SIZE = 5;
const SKELETON_CARDS = 3;

export default function TaskSection({ title, status, filters }) {
  const filterKey = JSON.stringify(filters);
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const page = pageState.key === filterKey ? pageState.page : 1;
  const setPage = (next) => setPageState({ key: filterKey, page: next });

  const { tasks, total, loading, error } = useTasks(filters, status, page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const offset = (page - 1) * PAGE_SIZE;
  const initialLoad = loading && tasks.length === 0;

  return (
    <section className="task-section">
      <header className="section-header">
        <span className={`status-badge ${status.toLowerCase()}`}>{title}</span>
        <span className="section-count">{total}</span>
      </header>

      <div className={`section-body${loading ? ' is-loading' : ''}`} aria-busy={loading}>
        {error && <div className="state-message error">Error: {error}</div>}

        {!error && initialLoad &&
          Array.from({ length: SKELETON_CARDS }, (_, i) => <div key={i} className="skeleton skeleton-card" />)}

        {!error && !loading && tasks.length === 0 && <div className="state-message">No tasks found.</div>}

        {!error && !initialLoad && tasks.map((task, index) => {
          const due = getDueInfo(task);

          return (
            <article key={task.id} className={`task-card priority-${(task.priority || '').toLowerCase()}`}>
              <span className="task-number">{offset + index + 1}</span>
              <div className="task-main">
                <div className="task-title">
                  <Highlight text={task.title} term={filters.query} />
                </div>
                <div className="task-desc">
                  <Highlight text={task.description} term={filters.query} />
                </div>
                <div className="task-meta">
                  <span className={`priority ${(task.priority || '').toLowerCase()}`}>{task.priority}</span>
                  <span className="task-assignee">{task.assignee || '—'}</span>
                </div>
                <div className="task-dates">
                  <span>Created {formatDate(task.createdAt)}</span>
                  {due && <span className={`due-badge ${due.tone}`}>{due.label}</span>}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}
