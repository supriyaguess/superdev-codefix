import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import FilterSelect from './components/FilterSelect';
import DateFilter from './components/DateFilter';
import SummaryBar from './components/SummaryBar';
import ActiveFilters from './components/ActiveFilters';
import TaskSection from './components/TaskSection';
import AssigneeBreakdown from './components/AssigneeBreakdown';
import { fetchAssigneeSummary, fetchAssignees, fetchSummary } from './api';
import { formatDate } from './utils/dates';

const SECTIONS = [
  { status: 'OPEN', title: 'Open' },
  { status: 'IN_PROGRESS', title: 'In Progress' },
  { status: 'DONE', title: 'Done' },
];

const DEFAULT_FILTERS = {
  query: '',
  assignee: '',
  priority: '',
  due: '',
  createdFrom: '',
  createdTo: '',
  sort: 'created_asc',
};

const PRIORITY_OPTIONS = [
  { value: '', label: 'All priorities' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

const DUE_OPTIONS = [
  { value: '', label: 'Any due date' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'soon', label: 'Due this week' },
];

const SORT_OPTIONS = [
  { value: 'created_asc', label: 'Oldest first' },
  { value: 'created_desc', label: 'Newest first' },
  { value: 'due_asc', label: 'Due soonest' },
  { value: 'priority', label: 'Highest priority' },
];

function buildChips(filters) {
  const chips = [];
  if (filters.query) chips.push({ key: 'query', label: `Search: "${filters.query}"` });
  if (filters.assignee) chips.push({ key: 'assignee', label: `Assignee: ${filters.assignee}` });
  if (filters.priority) chips.push({ key: 'priority', label: `Priority: ${filters.priority.toLowerCase()}` });
  if (filters.due) chips.push({ key: 'due', label: filters.due === 'overdue' ? 'Overdue' : 'Due this week' });
  if (filters.createdFrom) chips.push({ key: 'createdFrom', label: `From ${formatDate(filters.createdFrom)}` });
  if (filters.createdTo) chips.push({ key: 'createdTo', label: `To ${formatDate(filters.createdTo)}` });
  return chips;
}

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [assignees, setAssignees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState([]);

  const update = (patch) => setFilters((current) => ({ ...current, ...patch }));
  const clearAll = () => setFilters((current) => ({ ...DEFAULT_FILTERS, sort: current.sort }));

  useEffect(() => {
    fetchAssignees()
      .then(setAssignees)
      .catch(() => setAssignees([]));
  }, []);

  useEffect(() => {
    fetchAssigneeSummary()
      .then(setBreakdown)
      .catch(() => setBreakdown([]));
  }, []);

  useEffect(() => {
    fetchSummary(filters.assignee)
      .then(setSummary)
      .catch(() => setSummary(null));
  }, [filters.assignee]);

  const assigneeOptions = [
    { value: '', label: 'All assignees' },
    ...assignees.map((name) => ({ value: name, label: name })),
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Tracker</h1>
        <p className="subtitle">Internal task management</p>
      </header>

      <SummaryBar summary={summary} filters={filters} onToggle={update} />
      <AssigneeBreakdown rows={breakdown} selected={filters.assignee} onSelect={(assignee) => update({ assignee })} />

      <div className="controls">
        <SearchBar value={filters.query} onChange={(query) => update({ query })} />
        <FilterSelect label="Assignee" value={filters.assignee} options={assigneeOptions} onChange={(assignee) => update({ assignee })} />
        <FilterSelect label="Priority" value={filters.priority} options={PRIORITY_OPTIONS} onChange={(priority) => update({ priority })} />
        <FilterSelect label="Due" value={filters.due} options={DUE_OPTIONS} onChange={(due) => update({ due })} />
        <DateFilter label="Created from" value={filters.createdFrom} max={filters.createdTo} onChange={(createdFrom) => update({ createdFrom })} />
        <DateFilter label="Created to" value={filters.createdTo} min={filters.createdFrom} onChange={(createdTo) => update({ createdTo })} />
        <FilterSelect label="Sort by" value={filters.sort} options={SORT_OPTIONS} onChange={(sort) => update({ sort })} />
      </div>

      <ActiveFilters
        chips={buildChips(filters)}
        onRemove={(key) => update({ [key]: DEFAULT_FILTERS[key] })}
        onClear={clearAll}
      />

      <div className="board">
        {SECTIONS.map((section) => (
          <TaskSection key={section.status} {...section} filters={filters} />
        ))}
      </div>
    </div>
  );
}
