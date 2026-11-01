import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { dueText, fmtDate, todayStr } from '../utils';

const STAT_LABELS = [
  ['totalNotes', 'Total Notes'],
  ['importantNotes', 'Important Notes'],
  ['totalReminders', 'Total Reminders'],
  ['pendingReminders', 'Pending Reminders'],
  ['completedReminders', 'Completed Reminders'],
  ['todaysReminders', "Today's Reminders"]
];

// Every number on this page comes from GET /api/dashboard (MongoDB).
export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api(`/dashboard?today=${todayStr()}`)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="container">
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Welcome back, {user?.name}.</p>
        </div>
        <div className="quick">
          <Link className="btn btn-primary" to="/notes?new=1">+ New Note</Link>
          <Link className="btn btn-light" to="/reminders?new=1">+ New Reminder</Link>
        </div>
      </div>

      {error && <div className="empty">{error}</div>}
      {!data && !error && (
        <div className="loading"><span className="spinner" /> Loading...</div>
      )}

      {data && (
        <>
          <div className="grid-3">
            {STAT_LABELS.map(([key, label]) => (
              <div className="card stat" key={key}>
                <div className="num">{data.stats[key]}</div>
                <div className="label">{label}</div>
              </div>
            ))}
          </div>

          <div className="two-col">
            <section className="card">
              <h2 style={{ marginBottom: 8 }}>Recent Notes</h2>
              {data.recentNotes.length === 0 && <p className="muted">No notes yet. Create your first note.</p>}
              {data.recentNotes.map((n) => (
                <div className="list-item" key={n._id}>
                  <strong>
                    {n.title} {n.important && <span className="badge badge-important">Important</span>}
                  </strong>
                  <span className="muted">{n.category} | {fmtDate(n.updatedAt)}</span>
                </div>
              ))}
              <Link to="/notes" style={{ display: 'inline-block', marginTop: 10 }}>View all notes</Link>
            </section>

            <section className="card">
              <h2 style={{ marginBottom: 8 }}>Upcoming Reminders</h2>
              {data.upcomingReminders.length === 0 && <p className="muted">No upcoming reminders.</p>}
              {data.upcomingReminders.map((r) => (
                <div className="list-item" key={r._id}>
                  <strong>
                    {r.title} <span className={`badge prio-${r.priority}`}>{r.priority}</span>
                  </strong>
                  <span className="muted">{dueText(r)}</span>
                </div>
              ))}
              <Link to="/reminders" style={{ display: 'inline-block', marginTop: 10 }}>View all reminders</Link>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
