import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation
} from 'react-router-dom';

import { AuthProvider, useAuth } from './AuthContext';
import { ToastProvider } from './ToastContext';
import { useReminderNotifications } from './useReminderNotifications';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Reminders from './pages/Reminders';


// Pages that need a login
function ProtectedLayout() {
  const { user } = useAuth();

  useReminderNotifications(Boolean(user));

  return user
    ? <Outlet />
    : <Navigate to="/login" replace />;
}


// Login/Register pages
function PublicOnly({ children }) {
  const { user } = useAuth();

  return user
    ? <Navigate to="/dashboard" replace />
    : children;
}


export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <ToastProvider>

        {/* Hide old navbar on Home page */}
        {location.pathname !== '/' && <Navbar />}

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route
            path="/login"
            element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            }
          />

          <Route
            path="/register"
            element={
              <PublicOnly>
                <Register />
              </PublicOnly>
            }
          />

          <Route element={<ProtectedLayout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/notes"
              element={<Notes />}
            />

            <Route
              path="/reminders"
              element={<Reminders />}
            />
          </Route>

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>

      </ToastProvider>
    </AuthProvider>
  );
}