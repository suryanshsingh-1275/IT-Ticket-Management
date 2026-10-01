import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api';
import { STATUSES, fmtDate, shortId } from '../constants';
import { StatusBadge, PriorityText } from '../components/Badges';
import TicketModal from '../components/TicketModal';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Reload the list whenever the search text or status filter changes.
  // The small delay (debounce) avoids calling the API on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTickets();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, status]);

  async function loadTickets() {
    setBusy(true);
    try {
      const res = await api.get('/tickets/mine', { params: { search, status } });
      setTickets(res.data.tickets);
      setError('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const isFiltering = search || status;

  return (
    <>
      <div className="flex-between flex-wrap gap-2 mb-3">
        <h3>My tickets</h3>
        <Link to="/tickets/new" className="btn btn-primary">Raise ticket</Link>
      </div>

      <div className="grid mb-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <input
          className="input"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {busy ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : tickets.length === 0 ? (
        <div className="panel empty-state">
          {isFiltering ? (
            <p className="mb-0">No tickets match your search. Try a different word or status.</p>
          ) : (
            <>
              <p>You have not raised any tickets yet.</p>
              <Link to="/tickets/new" className="btn btn-primary">Raise your first ticket</Link>
            </>
          )}
        </div>
      ) : (
        <div className="stack">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className={'panel ticket-card t-' + ticket.status.replace(' ', '-')}
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex-between flex-wrap gap-2">
                <div>
                  <span className="id-tag small" style={{ marginRight: 8 }}>#{shortId(ticket)}</span>
                  <strong>{ticket.title}</strong>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
              <div className="text-muted small mt-1 truncate">{ticket.description}</div>
              <div className="small mt-2 flex flex-wrap gap-3 text-muted">
                <span>{ticket.category}</span>
                <span>Priority: <PriorityText priority={ticket.priority} /></span>
                <span>Raised {fmtDate(ticket.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </>
  );
}