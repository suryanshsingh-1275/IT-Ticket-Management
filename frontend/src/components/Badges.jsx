export function StatusBadge({ status }) {
  return <span className={`pill st-${status.replace(' ', '-')}`}>{status}</span>;
}

