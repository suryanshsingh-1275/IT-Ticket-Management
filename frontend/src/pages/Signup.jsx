import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';


export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', phone: '' });
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;


 