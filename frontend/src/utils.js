export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const CATEGORIES = ['College', 'Personal', 'Work', 'Project', 'Important', 'Other'];
export const PRIORITIES = ['Low', 'Medium', 'High'];

const pad = (n) => String(n).padStart(2, '0');

// Today's date in the user's local time, as YYYY-MM-DD
export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Accepts "YYYY-MM-DD" or a full ISO date-time string
export function fmtDate(s) {
  let d;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, day] = s.split('-').map(Number);
    d = new Date(y, m - 1, day);
  } else {
    d = new Date(s);
  }
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// "10:00" -> "10:00 AM"
export function fmtTime(t) {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`;
}

// "Today at 10:00 AM" or "20 Sep 2026 at 10:00 AM"
export function dueText(r) {
  return `${r.date === todayStr() ? 'Today' : fmtDate(r.date)} at ${fmtTime(r.time)}`;
}

export function isOverdue(r) {
  return !r.completed && new Date(`${r.date}T${r.time}:00`) < new Date();
}
