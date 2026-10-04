export default function SearchBar({ value, onChange }) {
  return (
    <label className="field search-field">
      <span className="field-label">Search</span>
      <div className="search-wrapper">
      <input
        type="text"
        className="search-input"
        placeholder="Search by title or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="search-clear" aria-label="Clear search" onClick={() => onChange('')}>
          &times;
        </button>
      )}
      </div>
    </label>
  );
}
