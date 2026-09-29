import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api';
import { CATEGORIES, PRIORITIES } from '../constants';

export default function RaiseTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'Hardware', priority: 'Medium' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

