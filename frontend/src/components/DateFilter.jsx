export default function DateFilter({ label, value, min, max, onChange }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        type="date"
        className="status-filter"
        value={value}
        min={min || undefined}
        max={max || undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
