import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { EMAIL_RE } from '../utils';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    const body = { ...form, name: form.name.trim(), email: form.email.trim() };
    if (!body.name || !body.email || !body.password || !body.confirmPassword) return setError('All fields are required');
    if (!EMAIL_RE.test(body.email)) return setError('Please enter a valid email address');
    if (body.password.length < 6) return setError('Password must be at least 6 characters');
    if (body.password !== body.confirmPassword) return setError('Passwords do not match');

    setBusy(true);
    try {
      const data = await api('/auth/register', { method: 'POST', body });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="container">
      <div className="card auth-box">
        <h1>Create account</h1>
        <p className="muted" style={{ marginBottom: 16 }}>Register to start saving notes and reminders.</p>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={submit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" autoComplete="name" maxLength={60} value={form.name} onChange={change} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" autoComplete="email" value={form.email} onChange={change} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password (min 6 characters)</label>
            <input type="password" id="password" name="password" autoComplete="new-password" value={form.password} onChange={change} />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={change} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
            {busy ? 'Please wait...' : 'Register'}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 14, textAlign: 'center' }}>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
