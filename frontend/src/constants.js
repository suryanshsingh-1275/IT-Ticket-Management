export const CATEGORIES = ['Hardware', 'Software', 'Network', 'Access', 'Email', 'Other'];

export const PRIORITIES = ['Low', 'Medium', 'High'];

export const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

export const shortId = (t) => String(t._id).slice(-6).toUpperCase();
