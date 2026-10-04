import { useState, useEffect } from 'react';
import { fetchTasks } from '../api';

export function useTasks(query, status, assignee, page, pageSize) {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      fetchTasks({ query, status, assignee, page, pageSize })
        .then((data) => {
          if (cancelled) return;
          setTasks(data.items);
          setTotal(data.total);
        })
        .catch((err) => {
          if (!cancelled) setError(err.message);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, status, assignee, page, pageSize]);

  return { tasks, total, loading, error };
}
