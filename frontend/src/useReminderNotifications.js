import { useEffect } from 'react';
import { api } from './api';
import { useToast } from './ToastContext';
import { dueText } from './utils';

// Checks pending reminders when the page opens and every 30 seconds.
// A due reminder is marked "notificationSent" in MongoDB FIRST, then shown, so it never repeats.
// This only works while the app is open in a browser tab (documented limitation).
export function useReminderNotifications(enabled) {
  const { addAlert } = useToast();

  useEffect(() => {
    if (!enabled) return undefined;
    let stopped = false;
    let running = false;

    async function check() {
      if (running) return;
      running = true;
      try {
        const list = await api('/reminders?status=pending');
        const now = new Date();
        for (const r of list) {
          if (stopped) break;
          if (r.notificationSent) continue;
          if (new Date(`${r.date}T${r.time}:00`) <= now) {
            await api(`/reminders/${r._id}`, { method: 'PUT', body: { notificationSent: true } });
            addAlert(r);
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Reminder: ${r.title}`, { body: dueText(r) });
            }
          }
        }
      } catch {
        /* ignore, we will try again in 30 seconds */
      }
      running = false;
    }

    check();
    const timer = setInterval(check, 30000);
    // The Reminders page fires this event after saving so a reminder set for "now" alerts immediately.
    window.addEventListener('reminders-changed', check);

    return () => {
      stopped = true;
      clearInterval(timer);
      window.removeEventListener('reminders-changed', check);
    };
  }, [enabled, addAlert]);
}
