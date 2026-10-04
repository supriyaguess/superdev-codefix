export default function SummaryBar({ summary, filters, onToggle }) {
  if (!summary) return null;

  const tiles = [
    { key: 'total', label: 'Total', value: summary.total },
    { key: 'open', label: 'Open', value: summary.open },
    { key: 'inProgress', label: 'In progress', value: summary.inProgress },
    { key: 'done', label: 'Done', value: summary.done },
    {
      key: 'highPending',
      label: 'High priority pending',
      value: summary.highPending,
      tone: 'danger',
      active: filters.priority === 'HIGH',
      onClick: () => onToggle({ priority: filters.priority === 'HIGH' ? '' : 'HIGH' }),
    },
    {
      key: 'overdue',
      label: 'Overdue',
      value: summary.overdue,
      tone: 'danger',
      active: filters.due === 'overdue',
      onClick: () => onToggle({ due: filters.due === 'overdue' ? '' : 'overdue' }),
    },
  ];

  return (
    <div className="summary-bar">
      {tiles.map(({ key, label, value, tone, active, onClick }) => {
        const className = `summary-tile${tone ? ` ${tone}` : ''}${active ? ' active' : ''}${onClick ? ' clickable' : ''}`;
        const content = (
          <>
            <span className="summary-value">{value}</span>
            <span className="summary-label">{label}</span>
          </>
        );

        return onClick ? (
          <button key={key} type="button" className={className} onClick={onClick}>
            {content}
          </button>
        ) : (
          <div key={key} className={className}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
