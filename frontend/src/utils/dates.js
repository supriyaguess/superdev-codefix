const MS_PER_DAY = 24 * 60 * 60 * 1000;
const SOON_DAYS = 7;

function parseDate(value) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(value) {
  return parseDate(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getDueInfo(task) {
  if (!task.dueDate) return null;

  const formatted = formatDate(task.dueDate);
  if (task.status === 'DONE') return { tone: 'done', label: `Due ${formatted}` };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((parseDate(task.dueDate) - today) / MS_PER_DAY);

  if (days < 0) return { tone: 'overdue', label: `Overdue by ${-days}d` };
  if (days === 0) return { tone: 'soon', label: 'Due today' };
  if (days <= SOON_DAYS) return { tone: 'soon', label: `Due in ${days}d` };
  return { tone: 'normal', label: `Due ${formatted}` };
}
