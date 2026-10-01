import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api';
import { CATEGORIES, PRIORITIES } from '../constants';

export default function RaiseTicket() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/tickets', { title, description, category, priority });
      navigate('/tickets');
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div className="center-mx" style={{ maxWidth: 640 }}>
      <h3 className="mb-1">Raise a ticket</h3>
      <p className="text-muted">Describe the problem and the IT team will pick it up.</p>

      <form className="panel" style={{ padding: 24 }} onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="field">
          <label>Title</label>
          <input
            className="input"
            maxLength={120}
            placeholder="e.g. Wi-Fi not working on 2nd floor"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>What is happening?</label>
          <textarea
            rows={5}
            maxLength={2000}
            className="textarea"
            placeholder="Include what you tried and any error messages."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="field">
            <label>Category</label>
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Priority</label>
            <select className="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Submitting...' : 'Submit ticket'}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/tickets')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}