const API_BASE = '/api';

async function getJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export function fetchTasks({ filters, status = '', page = 1, pageSize = 10 }) {
  const params = new URLSearchParams();
  const { query, assignee, priority, createdFrom, createdTo, due, sort } = filters;

  if (query) params.set('q', query);
  if (status) params.set('status', status);
  if (assignee) params.set('assignee', assignee);
  if (priority) params.set('priority', priority);
  if (createdFrom) params.set('createdFrom', createdFrom);
  if (createdTo) params.set('createdTo', createdTo);
  if (due) params.set('due', due);
  if (sort) params.set('sort', sort);
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));

  return getJson(`${API_BASE}/tasks?${params.toString()}`);
}

export function fetchAssignees() {
  return getJson(`${API_BASE}/assignees`);
}

export function fetchAssigneeSummary() {
  return getJson(`${API_BASE}/summary/assignees`);
}

export function fetchSummary(assignee = '') {
  const params = new URLSearchParams();
  if (assignee) params.set('assignee', assignee);
  return getJson(`${API_BASE}/summary?${params.toString()}`);
}
