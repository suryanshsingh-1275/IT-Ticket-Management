export function StatusBadge({ status }) {
  return <span className="pill">{status}</span>;
}

export function PriorityText({ priority }) {
  return <span className="priority">{priority}</span>;
}