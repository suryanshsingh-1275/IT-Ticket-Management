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

  