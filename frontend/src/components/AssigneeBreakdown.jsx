export default function AssigneeBreakdown({ rows, selected, onSelect }) {
  if (!rows || rows.length === 0) return null;

  return (
    <div className="breakdown">
      <h2 className="breakdown-title">Tasks by assignee</h2>
      <table className="breakdown-table">
        <thead>
          <tr>
            <th>Assignee</th>
            <th>Total</th>
            <th>Open</th>
            <th>In progress</th>
            <th>Done</th>
            <th>Overdue</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.assignee}
              className={row.assignee === selected ? 'selected' : ''}
              onClick={() => onSelect(row.assignee === selected ? '' : row.assignee)}
            >
              <td>{row.assignee}</td>
              <td>{row.total}</td>
              <td>{row.open}</td>
              <td>{row.inProgress}</td>
              <td>{row.done}</td>
              <td className={row.overdue > 0 ? 'overdue-count' : ''}>{row.overdue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
