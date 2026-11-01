import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { dueText } from './utils';

const ToastContext = createContext(null);

// Shows short success/error messages (toasts) and reminder alerts (stay until dismissed).
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const nextId = useRef(0);

  const toast = useCallback((message, type = 'success') => {
    const id = ++nextId.current;
    setToasts((list) => [...list, { id, message, type }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3500);
  }, []);

  const addAlert = useCallback((reminder) => {
    const id = ++nextId.current;
    setAlerts((list) => [...list, { id, reminder }]);
  }, []);

  const dismissAlert = (id) => setAlerts((list) => list.filter((a) => a.id !== id));

  return (
    <ToastContext.Provider value={{ toast, addAlert }}>
      {children}
      <div id="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
        ))}
        {alerts.map((a) => (
          <div key={a.id} className="reminder-alert">
            <span className="ra-label">Reminder</span>
            <strong>{a.reminder.title}</strong>
            <span className="muted">{dueText(a.reminder)}</span>
            <br />
            <button className="btn btn-sm btn-primary" onClick={() => dismissAlert(a.id)}>Dismiss</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
