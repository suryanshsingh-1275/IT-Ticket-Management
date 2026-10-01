import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api';
import { CATEGORIES, PRIORITIES, STATUSES, fmtDate, shortId } from '../constants';
import { PriorityText } from '../components/Badges';
import TicketModal from '../components/TicketModal';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTickets();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, status, priority, category]);

  async function loadTickets() {
    setBusy(true);
    try {
      const res = await api.get('/tickets', { params: { search, status, priority, category } });
      setTickets(res.data.tickets);
      setError('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleStatusChange(ticket, newStatus) {
    try {
      const res = await api.patch('/tickets/' + ticket._id + '/status', { status: newStatus });
      setTickets((list) =>
        list.map((t) =>
          t._id === ticket._id ? { ...t, status: res.data.ticket.status, updatedAt: res.data.ticket.updatedAt } : t
        )
      );
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function handleDelete(ticket) {
    const confirmed = window.confirm('Delete ticket "' + ticket.title + '"? This cannot be undone.');
    if (!confirmed) return;
    try {
      await api.delete('/tickets/' + ticket._id);
      setTickets((list) => list.filter((t) => t._id !== ticket._id));
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <>
      <h3 className="mb-3">All tickets</h3>

      <div className="grid cols-4 mb-3" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
        <input
          className="input"
          placeholder="Search title, description, employee name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {busy ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : tickets.length === 0 ? (
        <div className="panel empty-state">No tickets match these filters.</div>
      ) : (
        <div className="panel table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th><th>Title</th><th>Raised by</th><th>Category</th>
                <th>Priority</th><th style={{ minWidth: 150 }}>Status</th><th>Date</th><th />
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="id-tag">#{shortId(ticket)}</td>
                  <td>
                    <span className="clickable" onClick={() => setSelectedTicket(ticket)}>
                      {ticket.title}
                    </span>
                  </td>
                  <td>
                    {ticket.createdBy ? ticket.createdBy.name : 'Deleted user'}
                    {ticket.createdBy && ticket.createdBy.department && (
                      <div className="small text-muted">{ticket.createdBy.department}</div>
                    )}
                  </td>
                  <td>{ticket.category}</td>
                  <td><PriorityText priority={ticket.priority} /></td>
                  <td>
                    <select
                      className="select select-sm"
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket, e.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{fmtDate(ticket.createdAt)}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ticket)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </>
  );
}
