import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api';
import { CATEGORIES, PRIORITIES, STATUSES, fmtDate, shortId } from '../constants';
import { PriorityText } from '../components/Badges';
import TicketModal from '../components/TicketModal';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/tickets', { params: filters });
        setTickets(res.data.tickets);
        setError('');
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [filters]);

  const setFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const updateStatus = async (ticket, status) => {
    try {
      const res = await api.patch(`/tickets/${ticket._id}/status`, { status });
      setTickets((list) => list.map((t) => (t._id === ticket._id ? { ...t, status: res.data.ticket.status, updatedAt: res.data.ticket.updatedAt } : t)));
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const remove = async (ticket) => {
    if (!window.confirm(`Delete ticket "${ticket.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/tickets/${ticket._id}`);
      setTickets((list) => list.filter((t) => t._id !== ticket._id));
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <>
      <h3 className="mb-3">All tickets</h3>

      <div className="row g-2 mb-3">
        <div className="col-lg-5">
          <input name="search" className="form-control" placeholder="Search title, description, employee name or email" value={filters.search} onChange={setFilter} />
        </div>
        <div className="col-4 col-lg-2">
          <select name="status" className="form-select" value={filters.status} onChange={setFilter}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-4 col-lg-2">
          <select name="priority" className="form-select" value={filters.priority} onChange={setFilter}>
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="col-4 col-lg-3">
          <select name="category" className="form-select" value={filters.category} onChange={setFilter}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-secondary" /></div>
      ) : tickets.length === 0 ? (
        <div className="panel p-5 text-center">No tickets match these filters.</div>
      ) : (
        <div className="panel table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr><th>ID</th><th>Title</th><th>Raised by</th><th>Category</th><th>Priority</th><th style={{ minWidth: 150 }}>Status</th><th>Date</th><th /></tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id}>
                  <td className="id-tag">#{shortId(t)}</td>
                  <td><span className="clickable" onClick={() => setSelected(t)}>{t.title}</span></td>
                  <td>
                    {t.createdBy?.name || 'Deleted user'}
                    {t.createdBy?.department && <div className="small text-secondary">{t.createdBy.department}</div>}
                  </td>
                  <td>{t.category}</td>
                  <td><PriorityText priority={t.priority} /></td>
                  <td>
                    <select className="form-select form-select-sm" value={t.status} onChange={(e) => updateStatus(t, e.target.value)}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{fmtDate(t.createdAt)}</td>
                  <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => remove(t)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TicketModal ticket={selected} onClose={() => setSelected(null)} />
    </>
  );
}