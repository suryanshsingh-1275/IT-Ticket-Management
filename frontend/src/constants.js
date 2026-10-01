export const CATEGORIES = ['Hardware', 'Software', 'Network', 'Access', 'Email', 'Other'];

export const PRIORITIES = ['Low', 'Medium', 'High'];

export const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

export function shortId(ticket) {
  return String(ticket._id).slice(-6).toUpperCase();
}

export function fmtDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}