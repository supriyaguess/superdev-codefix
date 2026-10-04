export default function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select className="status-filter" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
