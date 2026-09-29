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

  