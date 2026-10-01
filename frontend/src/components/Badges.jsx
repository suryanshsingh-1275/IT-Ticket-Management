export function StatusBadge({ status }) {
  const className = 'pill st-' + status.replace(' ', '-');
  return <span className={className}>{status}</span>;
}

export function PriorityText({ priority }) {
  const className = 'pr-text-' + priority;
  return <span className={className}>{priority}</span>;
}