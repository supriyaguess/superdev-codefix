export default function ActiveFilters({ chips, onRemove, onClear }) {
  if (chips.length === 0) return null;

  return (
    <div className="chips">
      {chips.map((chip) => (
        <button key={chip.key} type="button" className="chip" onClick={() => onRemove(chip.key)}>
          {chip.label} <span aria-hidden="true">&times;</span>
        </button>
      ))}
      <button type="button" className="chip-clear" onClick={onClear}>
        Clear all
      </button>
    </div>
  );
}
