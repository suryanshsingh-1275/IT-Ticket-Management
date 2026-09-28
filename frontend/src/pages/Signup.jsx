import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';


export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', phone: '' });
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;


  return (
    <div className="auth-wrap panel p-4">
      <h3 className="mb-1">Create account</h3>
      <p className="text-secondary">Register to raise support tickets and track their status.</p>
     
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Full name</label>
          <input name="name"
           className="form-control"
            value={form.name}
             onChange={onChange} required autoFocus />
        </div>
        <div className="mb-3">
          <label className="form-label">Work email</label>
          <input type="email"
           name="email"
           className="form-control" 
           value={form.email} 
           onChange={onChange} required />
        </div>
        <div className="row">
          <div className="col-sm-6 mb-3">
            <label className="form-label">Department</label>
            <input name="department"
             className="form-control"
              value={form.department} 
              onChange={onChange} />
          </div>
          <div className="col-sm-6 mb-3">
            <label className="form-label">Phone</label>
            <input name="phone" 
            className="form-control"
             value={form.phone} 
             onChange={onChange} />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control" 
          value={form.password}
           onChange={onChange}
            minLength={6} required />
          <div className="form-text">At least 6 characters.</div>
        </div>
        <button className="btn btn-primary w-100" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
      </form>
      <p className="mt-3 mb-0 small">Already registered? <Link to="/login">Log in</Link></p>
    </div>
  );
}