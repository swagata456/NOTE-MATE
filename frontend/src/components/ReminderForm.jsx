import { useState } from 'react';
import { api } from '../api';
import { PRIORITIES, todayStr } from '../utils';
import Modal from './Modal';

// reminder = existing reminder (edit) or null (create)
export default function ReminderForm({ reminder, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: reminder?.title || '',
    description: reminder?.description || '',
    date: reminder?.date || todayStr(),
    time: reminder?.time || '09:00',
    priority: reminder?.priority || 'Medium'
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    const body = { ...form, title: form.title.trim() };
    if (!body.title || !body.date || !body.time) return setError('Title, date and time are required');

    setSaving(true);
    try {
      if (reminder) await api(`/reminders/${reminder._id}`, { method: 'PUT', body });
      else await api('/reminders', { method: 'POST', body });
      onSaved(Boolean(reminder));
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title={reminder ? 'Edit Reminder' : 'New Reminder'} onClose={onClose}>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={submit} noValidate>
        <div className="form-group">
          <label htmlFor="rTitle">Reminder Title</label>
          <input type="text" id="rTitle" name="title" maxLength={120} value={form.title} onChange={change} autoFocus />
        </div>
        <div className="form-group">
          <label htmlFor="rDesc">Description</label>
          <textarea id="rDesc" name="description" style={{ minHeight: 80 }} value={form.description} onChange={change} />
        </div>
        <div className="row-2">
          <div className="form-group">
            <label htmlFor="rDate">Date</label>
            <input type="date" id="rDate" name="date" value={form.date} onChange={change} />
          </div>
          <div className="form-group">
            <label htmlFor="rTime">Time</label>
            <input type="time" id="rTime" name="time" value={form.time} onChange={change} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="rPriority">Priority</label>
          <select id="rPriority" name="priority" value={form.priority} onChange={change}>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={saving}>Save Reminder</button>
        </div>
      </form>
    </Modal>
  );
}
