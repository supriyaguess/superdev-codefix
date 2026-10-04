import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import AssigneeFilter from './components/AssigneeFilter';
import TaskSection from './components/TaskSection';
import { fetchAssignees } from './api';

const SECTIONS = [
  { status: 'OPEN', title: 'Open' },
  { status: 'IN_PROGRESS', title: 'In Progress' },
  { status: 'DONE', title: 'Done' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [assignee, setAssignee] = useState('');
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    fetchAssignees()
      .then(setAssignees)
      .catch(() => setAssignees([]));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Tracker</h1>
        <p className="subtitle">Internal task management</p>
      </header>

      <div className="controls">
        <SearchBar value={query} onChange={setQuery} />
        <AssigneeFilter value={assignee} options={assignees} onChange={setAssignee} />
      </div>

      <div className="board">
        {SECTIONS.map((section) => (
          <TaskSection key={section.status} {...section} query={query} assignee={assignee} />
        ))}
      </div>
    </div>
  );
}
