import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';

const LOGGED_IN = [['/dashboard', 'Dashboard'], ['/notes', 'Notes'], ['/reminders', 'Reminders'], ['/about', 'About']];
const LOGGED_OUT = [['/', 'Home'], ['/about', 'About'], ['/login', 'Login'], ['/register', 'Register']];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [permission, setPermission] = useState(() =>
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  // Close the mobile menu after navigating
  useEffect(() => setMenuOpen(false), [location.pathname]);

  async function enableAlerts() {
    const result = await Notification.requestPermission();
    setPermission(result);
    toast(
      result === 'granted' ? 'Browser alerts enabled' : 'Browser alerts blocked. In-app alerts still work.',
      result === 'granted' ? 'success' : 'error'
    );
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link className="brand" to={user ? '/dashboard' : '/'}>
          NOTE<span>-</span>MATE
        </Link>
        <button className="nav-toggle" aria-label="Menu" onClick={() => setMenuOpen((o) => !o)}>
          Menu
        </button>
        <div className={`nav-links${menuOpen ? ' open' : ''}`}>
          {(user ? LOGGED_IN : LOGGED_OUT).map(([to, label]) => (
            <NavLink key={to} to={to} end>{label}</NavLink>
          ))}
          {user && (
            <>
              {permission === 'default' && (
                <button className="btn btn-sm btn-outline" onClick={enableAlerts}>Enable alerts</button>
              )}
              <span className="nav-user">{user.name}</span>
              <button className="btn btn-sm btn-outline" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
