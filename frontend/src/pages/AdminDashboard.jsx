import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api';
import { PRIORITIES, STATUSES, fmtDate, shortId } from '../constants';
import { StatusBadge } from '../components/Badges';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setBusy(true);
    try {
      const res = await api.get('/tickets/stats');
      setStats(res.data);
      setError('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (busy) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const maxPriorityCount = Math.max(1, ...PRIORITIES.map((p) => stats.byPriority[p]));

  return (
    <>
      <div className="flex-between mb-3">
        <h3>Dashboard</h3>
        <Link to="/admin/tickets" className="btn btn-primary">Manage tickets</Link>
      </div>

      <div className="grid cols-fit mb-4">
        <div className="tile t-Total">
          <div className="num">{stats.total}</div>
          <div className="text-muted small">Total tickets</div>
        </div>
        {STATUSES.map((status) => (
          <div className={'tile t-' + status.replace(' ', '-')} key={status}>
            <div className="num">{stats.byStatus[status]}</div>
            <div className="text-muted small">{status}</div>
          </div>
        ))}
      </div>

      <div className="grid split-4-8">
        <div className="panel" style={{ padding: 16 }}>
          <h6 className="mb-3">Tickets by priority</h6>
          {PRIORITIES.slice().reverse().map((priority) => (
            <div key={priority} className="mb-3">
              <div className="flex-between small mb-1">
                <span>{priority}</span>
                <strong>{stats.byPriority[priority]}</strong>
              </div>
              <div className="bar-track">
                <div
                  className={'bar-fill bar-' + priority}
                  style={{ width: (stats.byPriority[priority] / maxPriorityCount) * 100 + '%' }}
                />
              </div>
            </div>
          ))}
          <div className="small text-muted mt-3">{stats.users} registered employees</div>
        </div>

        <div className="panel" style={{ padding: 16 }}>
          <h6 className="mb-3">Latest tickets</h6>
          {stats.recent.length === 0 ? (
            <p className="text-muted mb-0">No tickets yet. New ones will show up here.</p>
          ) : (
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr><th>ID</th><th>Title</th><th>Raised by</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {stats.recent.map((ticket) => (
                    <tr key={ticket._id}>
                      <td className="id-tag">#{shortId(ticket)}</td>
                      <td>{ticket.title}</td>
                      <td>{ticket.createdBy ? ticket.createdBy.name : 'Deleted user'}</td>
                      <td><StatusBadge status={ticket.status} /></td>
                      <td>{fmtDate(ticket.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
