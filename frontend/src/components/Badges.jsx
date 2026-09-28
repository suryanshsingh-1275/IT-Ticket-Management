export function StatusBadge({ status }) {
  return <span className={`pill st-${status.replace(' ', '-')}`}>{status}</span>;
}

export function PriorityText({ priority }) {
  return <span className={`pr-text-${priority}`}>{priority}</span>;
}