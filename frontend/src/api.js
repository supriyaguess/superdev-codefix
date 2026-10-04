const API_BASE = '/api';

export async function fetchTasks({ query = '', status = '', assignee = '', page = 1, pageSize = 10 }) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (status) params.set('status', status);
  if (assignee) params.set('assignee', assignee);
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));

  const response = await fetch(`${API_BASE}/tasks?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchAssignees() {
  const response = await fetch(`${API_BASE}/assignees`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
