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

  