import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../ToastContext';
import { CATEGORIES, fmtDate } from '../utils';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import NoteForm from '../components/NoteForm';

export default function Notes() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [importantOnly, setImportantOnly] = useState(false);

  // formNote: undefined = form closed, null = new note, object = editing that note
  const [formNote, setFormNote] = useState(undefined);
  const [viewNote, setViewNote] = useState(null);
  const [deleteNote, setDeleteNote] = useState(null);

  const reload = () => setReloadKey((k) => k + 1);

  // "+ New Note" on the dashboard links here with ?new=1
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setFormNote(null);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Wait 300 ms after typing stops before searching
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (category) params.set('category', category);
    if (importantOnly) params.set('important', 'true');

    api(`/notes?${params}`)
      .then((list) => {
        if (cancelled) return;
        setNotes(list);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category, importantOnly, reloadKey]);

  const filtersActive = Boolean(debouncedSearch || category || importantOnly);

  async function toggleImportant(n) {
    try {
      await api(`/notes/${n._id}`, {
        method: 'PUT',
        body: { title: n.title, content: n.content, category: n.category, tags: n.tags, important: !n.important }
      });
      toast(n.important ? 'Removed from important' : 'Marked as important');
      reload();
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  async function confirmDelete() {
    const n = deleteNote;
    setDeleteNote(null);
    try {
      await api(`/notes/${n._id}`, { method: 'DELETE' });
      toast('Note deleted');
      reload();
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  function saved(wasEdit) {
    setFormNote(undefined);
    toast(wasEdit ? 'Note updated' : 'Note created');
    reload();
  }

  return (
    <main className="container">
      <div className="page-head">
        <h1>My Notes</h1>
        <button className="btn btn-primary" onClick={() => setFormNote(null)}>+ New Note</button>
      </div>

      <div className="toolbar">
        <input type="search" placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select aria-label="Category filter" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="check">
          <input type="checkbox" checked={importantOnly} onChange={(e) => setImportantOnly(e.target.checked)} /> Important only
        </label>
      </div>

      <div className="grid">
        {loading && <div className="loading"><span className="spinner" /> Loading notes...</div>}
        {!loading && error && (
          <div className="empty"><h3>Could not load notes</h3><p>{error}</p></div>
        )}
        {!loading && !error && notes.length === 0 && (
          filtersActive
            ? <div className="empty"><h3>No notes found</h3><p>Try a different search word or clear the filters.</p></div>
            : <div className="empty"><h3>No notes yet</h3><p>Click "New Note" to create your first note.</p></div>
        )}
        {!loading && !error && notes.map((n) => (
          <article key={n._id} className={`card note-card${n.important ? ' is-important' : ''}`}>
            <div className="card-top">
              <h3>{n.title}</h3>
              {n.important && <span className="badge badge-important">Important</span>}
            </div>
            <p className="preview">
              {n.content ? (n.content.length > 120 ? `${n.content.slice(0, 120)}...` : n.content) : <em>No content</em>}
            </p>
            <div className="meta">
              <span className="badge">{n.category}</span>
              {(n.tags || []).map((t) => <span className="tag" key={t}>#{t}</span>)}
            </div>
            <div className="date">Created {fmtDate(n.createdAt)} | Updated {fmtDate(n.updatedAt)}</div>
            <div className="actions">
              <button className="btn btn-sm btn-light" onClick={() => setViewNote(n)}>View</button>
              <button className="btn btn-sm btn-light" onClick={() => setFormNote(n)}>Edit</button>
              <button className="btn btn-sm btn-light" onClick={() => toggleImportant(n)}>
                {n.important ? 'Unmark' : 'Mark important'}
              </button>
              <button className="btn btn-sm btn-danger-outline" onClick={() => setDeleteNote(n)}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      {formNote !== undefined && (
        <NoteForm note={formNote} onClose={() => setFormNote(undefined)} onSaved={saved} />
      )}

      {viewNote && (
        <Modal title={viewNote.title} onClose={() => setViewNote(null)}>
          <div className="meta">
            <span className="badge">{viewNote.category}</span>
            {viewNote.important && <span className="badge badge-important">Important</span>}
            {(viewNote.tags || []).map((t) => <span className="tag" key={t}>#{t}</span>)}
          </div>
          <div className="view-body">{viewNote.content || '(No content)'}</div>
          <div className="date">Created {fmtDate(viewNote.createdAt)} | Updated {fmtDate(viewNote.updatedAt)}</div>
          <div className="modal-actions">
            <button className="btn btn-light" onClick={() => setViewNote(null)}>Close</button>
          </div>
        </Modal>
      )}

      {deleteNote && (
        <ConfirmDialog
          message={`Delete the note "${deleteNote.title}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteNote(null)}
        />
      )}
    </main>
  );
}
