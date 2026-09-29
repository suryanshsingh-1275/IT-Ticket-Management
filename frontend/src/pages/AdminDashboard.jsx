import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api';
import { PRIORITIES, STATUSES, fmtDate, shortId } from '../constants';
import { StatusBadge } from '../components/Badges';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tickets/stats').then((r) => setStats(r.data)).catch((e) => setError(errorMessage(e)));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return <div className="text-center py-5"><div className="spinner-border text-secondary" /></div>;

  const maxPr = Math.max(1, ...PRIORITIES.map((p) => stats.byPriority[p]));

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Dashboard</h3>
        <Link to="/admin/tickets" className="btn btn-primary">Manage tickets</Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md">
          <div className="tile t-Total"><div className="num">{stats.total}</div><div className="text-secondary small">Total tickets</div></div>
        </div>
        {STATUSES.map((s) => (
          <div className="col-6 col-md" key={s}>
            <div className={`tile t-${s.replace(' ', '-')}`}>
              <div className="num">{stats.byStatus[s]}</div>
              <div className="text-secondary small">{s}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="panel p-3 h-100">
            <h6 className="mb-3">Tickets by priority</h6>
            {PRIORITIES.slice().reverse().map((p) => (
              <div key={p} className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>{p}</span><strong>{stats.byPriority[p]}</strong>
                </div>
                <div className="bar-track"><div className={`bar-fill bar-${p}`} style={{ width: `${(stats.byPriority[p] / maxPr) * 100}%` }} /></div>
              </div>
            ))}
            <div className="small text-secondary mt-3">{stats.users} registered employees</div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="panel p-3 h-100">
            <h6 className="mb-3">Latest tickets</h6>
            {stats.recent.length === 0 ? (
              <p className="text-secondary mb-0">No tickets yet. New ones will show up here.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead><tr><th>ID</th><th>Title</th><th>Raised by</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {stats.recent.map((t) => (
                      <tr key={t._id}>
                        <td className="id-tag">#{shortId(t)}</td>
                        <td>{t.title}</td>
                        <td>{t.createdBy?.name || 'Deleted user'}</td>
                        <td><StatusBadge status={t.status} /></td>
                        <td>{fmtDate(t.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}