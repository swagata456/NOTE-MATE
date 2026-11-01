import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { EMAIL_RE } from '../utils';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    const email = form.email.trim();
    if (!email || !form.password) return setError('Email and password are required');
    if (!EMAIL_RE.test(email)) return setError('Please enter a valid email address');

    setBusy(true);
    try {
      const data = await api('/auth/login', { method: 'POST', body: { email, password: form.password } });
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
        <h1>Login</h1>
        <p className="muted" style={{ marginBottom: 16 }}>Welcome back. Log in to see your notes.</p>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={submit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" autoComplete="email" value={form.email} onChange={change} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" autoComplete="current-password" value={form.password} onChange={change} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
            {busy ? 'Please wait...' : 'Login'}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 14, textAlign: 'center' }}>
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </main>
  );
}
