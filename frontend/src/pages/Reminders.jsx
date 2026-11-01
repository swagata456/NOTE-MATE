import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../ToastContext';
import { fmtDate, fmtTime, isOverdue, PRIORITIES, todayStr } from '../utils';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import ReminderForm from '../components/ReminderForm';

const statusOf = (r) => (r.completed ? 'Completed' : isOverdue(r) ? 'Overdue' : 'Pending');

export default function Reminders() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [when, setWhen] = useState('');

  // formItem: undefined = closed, null = new reminder, object = editing that reminder
  const [formItem, setFormItem] = useState(undefined);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setFormItem(null);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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
    if (priority) params.set('priority', priority);
    if (status) params.set('status', status);
    if (when) {
      params.set('when', when);
      params.set('today', todayStr());
    }

    api(`/reminders?${params}`)
      .then((list) => {
        if (cancelled) return;
        setReminders(list);
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
  }, [debouncedSearch, priority, status, when, reloadKey]);

  const filtersActive = Boolean(debouncedSearch || priority || status || when);

  async function toggleCompleted(r) {
    try {
      await api(`/reminders/${r._id}`, { method: 'PUT', body: { completed: !r.completed } });
      toast(r.completed ? 'Marked as pending' : 'Marked as completed');
      reload();
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  async function confirmDelete() {
    const r = deleteItem;
    setDeleteItem(null);
    try {
      await api(`/reminders/${r._id}`, { method: 'DELETE' });
      toast('Reminder deleted');
      reload();
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  function saved(wasEdit) {
    setFormItem(undefined);
    toast(wasEdit ? 'Reminder updated' : 'Reminder created');
    reload();
    window.dispatchEvent(new Event('reminders-changed')); // a reminder set for "now" alerts right away
  }

  return (
    <main className="container">
      <div className="page-head">
        <h1>My Reminders</h1>
        <button className="btn btn-primary" onClick={() => setFormItem(null)}>+ New Reminder</button>
      </div>

      <div className="toolbar">
        <input type="search" placeholder="Search reminders..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select aria-label="Priority filter" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          {[...PRIORITIES].reverse().map((p) => <option key={p}>{p}</option>)}
        </select>
        <select aria-label="Status filter" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select aria-label="Date filter" value={when} onChange={(e) => setWhen(e.target.value)}>
          <option value="">Any date</option>
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      <div className="grid">
        {loading && <div className="loading"><span className="spinner" /> Loading reminders...</div>}
        {!loading && error && (
          <div className="empty"><h3>Could not load reminders</h3><p>{error}</p></div>
        )}
        {!loading && !error && reminders.length === 0 && (
          filtersActive
            ? <div className="empty"><h3>No reminders found</h3><p>Try a different search or clear the filters.</p></div>
            : <div className="empty"><h3>No reminders yet</h3><p>Click "New Reminder" to create your first reminder.</p></div>
        )}
        {!loading && !error && reminders.map((r) => (
          <article key={r._id} className={`card reminder-card${r.completed ? ' done' : ''}`}>
            <div className="card-top">
              <h3>{r.title}</h3>
              <span className={`badge st-${statusOf(r)}`}>{statusOf(r)}</span>
            </div>
            <div className="meta"><span className={`badge prio-${r.priority}`}>{r.priority} priority</span></div>
            <div className="date">
              <strong>{r.date === todayStr() ? 'Today' : fmtDate(r.date)} at {fmtTime(r.time)}</strong>
            </div>
            {r.description && (
              <p className="preview">{r.description.length > 100 ? `${r.description.slice(0, 100)}...` : r.description}</p>
            )}
            <div className="actions">
              <button className="btn btn-sm btn-primary" onClick={() => toggleCompleted(r)}>
                {r.completed ? 'Mark pending' : 'Mark completed'}
              </button>
              <button className="btn btn-sm btn-light" onClick={() => setViewItem(r)}>View</button>
              <button className="btn btn-sm btn-light" onClick={() => setFormItem(r)}>Edit</button>
              <button className="btn btn-sm btn-danger-outline" onClick={() => setDeleteItem(r)}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      {formItem !== undefined && (
        <ReminderForm reminder={formItem} onClose={() => setFormItem(undefined)} onSaved={saved} />
      )}

      {viewItem && (
        <Modal title={viewItem.title} onClose={() => setViewItem(null)}>
          <div className="meta">
            <span className={`badge prio-${viewItem.priority}`}>{viewItem.priority} priority</span>
            <span className={`badge st-${statusOf(viewItem)}`}>{statusOf(viewItem)}</span>
          </div>
          <div className="view-body">{viewItem.description || '(No description)'}</div>
          <div className="date">Due {fmtDate(viewItem.date)} at {fmtTime(viewItem.time)}</div>
          <div className="modal-actions">
            <button className="btn btn-light" onClick={() => setViewItem(null)}>Close</button>
          </div>
        </Modal>
      )}

      {deleteItem && (
        <ConfirmDialog
          message={`Delete the reminder "${deleteItem.title}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </main>
  );
}
