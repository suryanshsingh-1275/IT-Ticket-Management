import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';


export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const u = await login(form.email, form.password);
      navigate(u.role === 'admin' ? '/admin' : '/tickets');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

 return (
    <div className="auth-wrap panel p-4">
      <h3 className="mb-1">Log in</h3>
      <p className="text-secondary">Use your Nettech account to raise or manage tickets.</p>
     
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" 
          name="email"
           className="form-control" 
           value={form.email} 
           onChange={onChange} required autoFocus />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" 
          name="password"
           className="form-control" 
          value={form.password} 
          onChange={onChange} required />
        </div>
        <button className="btn btn-primary w-100" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
      </form>
      <p className="mt-3 mb-0 small">New employee? <Link to="/register">Create an account</Link></p>
    </div>
  );
}