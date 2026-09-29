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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/tickets/mine', { params: { search, status } });
        setTickets(res.data.tickets);
        setError('');
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [search, status]);

  const filtering = search || status;

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h3 className="mb-0">My tickets</h3>
        <Link to="/tickets/new" className="btn btn-primary">Raise ticket</Link>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input className="form-control" placeholder="Search by title or description" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-secondary" /></div>
      ) : tickets.length === 0 ? (
        <div className="panel p-5 text-center">
          {filtering ? (
            <p className="mb-0">No tickets match your search. Try a different word or status.</p>
          ) : (
            <>
              <p>You have not raised any tickets yet.</p>
              <div><Link to="/tickets/new" className="btn btn-primary">Raise your first ticket</Link></div>
            </>
          )}
        </div>
      ) : (
        <div className="d-grid gap-2">
          {tickets.map((t) => (
            <div key={t._id} className={`panel ticket-card t-${t.status.replace(' ', '-')} p-3`} onClick={() => setSelected(t)}>
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                <div>
                  <span className="id-tag small me-2">#{shortId(t)}</span>
                  <strong>{t.title}</strong>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div className="text-secondary small mt-1 text-truncate">{t.description}</div>
              <div className="small mt-2 d-flex flex-wrap gap-3 text-secondary">
                <span>{t.category}</span>
                <span>Priority: <PriorityText priority={t.priority} /></span>
                <span>Raised {fmtDate(t.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <TicketModal ticket={selected} onClose={() => setSelected(null)} />
    </>
  );
}