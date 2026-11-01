import { useState } from 'react';
import { api } from '../api';
import { CATEGORIES } from '../utils';
import Modal from './Modal';

// note = existing note (edit) or null (create)
export default function NoteForm({ note, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: note?.title || '',
    content: note?.content || '',
    category: note?.category || 'Personal',
    tags: (note?.tags || []).join(', '),
    important: note?.important || false
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const change = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  async function submit(e) {
    e.preventDefault();
    setError('');
    const body = { ...form, title: form.title.trim() };
    if (!body.title) return setError('Title is required');

    setSaving(true);
    try {
      if (note) await api(`/notes/${note._id}`, { method: 'PUT', body });
      else await api('/notes', { method: 'POST', body });
      onSaved(Boolean(note));
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title={note ? 'Edit Note' : 'New Note'} onClose={onClose}>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={submit} noValidate>
        <div className="form-group">
          <label htmlFor="nTitle">Title</label>
          <input type="text" id="nTitle" name="title" maxLength={120} value={form.title} onChange={change} autoFocus />
        </div>
        <div className="form-group">
          <label htmlFor="nContent">Content</label>
          <textarea id="nContent" name="content" value={form.content} onChange={change} />
        </div>
        <div className="row-2">
          <div className="form-group">
            <label htmlFor="nCategory">Category</label>
            <select id="nCategory" name="category" value={form.category} onChange={change}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="nTags">Tags (comma separated)</label>
            <input type="text" id="nTags" name="tags" placeholder="DBMS, Assignment" value={form.tags} onChange={change} />
          </div>
        </div>
        <label className="check">
          <input type="checkbox" name="important" checked={form.important} onChange={change} /> Mark as important
        </label>
        <div className="modal-actions">
          <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={saving}>Save Note</button>
        </div>
      </form>
    </Modal>
  );
}
