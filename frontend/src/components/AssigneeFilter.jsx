export default function AssigneeFilter({ value, options, onChange }) {
  return (
    <select className="status-filter" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">All assignees</option>
      {options.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}
