import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api';
import { CATEGORIES, PRIORITIES } from '../constants';

export default function RaiseTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'Hardware', priority: 'Medium' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

return (
    <div className="mx-auto" style={{ maxWidth: 640 }}>
      <h3 className="mb-1">Raise a ticket</h3>
      <p className="text-secondary">Describe the problem and the IT team will pick it up.</p>
      <form className="panel p-4" onSubmit={onSubmit}>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input name="title" className="form-control" maxLength={120} placeholder="e.g. Wi-Fi not working on 2nd floor" value={form.title} onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">What is happening?</label>
          <textarea name="description" rows={5} maxLength={2000} className="form-control" placeholder="Include what you tried and any error messages." value={form.description} onChange={onChange} required />
        </div>
        <div className="row">
          <div className="col-sm-6 mb-3">
            <label className="form-label">Category</label>
            <select name="category" className="form-select" value={form.category} onChange={onChange}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-sm-6 mb-3">
            <label className="form-label">Priority</label>
            <select name="priority" className="form-select" value={form.priority} onChange={onChange}>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Submitting...' : 'Submit ticket'}</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/tickets')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}