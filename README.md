# NOTE-MATE - Personal Notes & Reminder

NOTE-MATE is a beginner-friendly web application for keeping personal notes and reminders. The frontend is built with **React**; the backend uses Node.js, Express and MongoDB.

## Features

- Register and log in (passwords are hashed with bcrypt, login uses a JWT token)
- Notes: create, view, edit, delete, categories, tags, mark important
- Search notes by title, content, category or tags (results update as you type)
- Reminders: create, view, edit, delete, mark completed or pending
- Reminder search, filter by priority, status, and today / upcoming
- Dashboard with live statistics from MongoDB, recent notes and upcoming reminders
- Reminder notifications (in-app alert plus optional browser notification)
- Responsive layout for desktop, tablet and mobile
- Every user sees only their own data

## Technologies

| Part | Technology |
|------|------------|
| Frontend | React 18, React Router, Vite (build tool), CSS3 |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Security | bcryptjs, jsonwebtoken, environment variables |

## Folder structure

```text
NOTE-MATE/
├── frontend/                  React app
│   ├── index.html
│   ├── package.json, vite.config.js
│   ├── dist/                  ready-built app (served by the backend)
│   └── src/
│       ├── main.jsx, App.jsx, style.css
│       ├── api.js, utils.js
│       ├── AuthContext.jsx, ToastContext.jsx, useReminderNotifications.js
│       ├── components/ (Navbar, Modal, ConfirmDialog, NoteForm, ReminderForm)
│       └── pages/ (Home, Login, Register, Dashboard, Notes, Reminders, About)
├── backend/
│   ├── server.js, package.json, .env.example
│   ├── models/ (User.js, Note.js, Reminder.js)
│   ├── routes/ (authRoutes.js, noteRoutes.js, reminderRoutes.js, dashboardRoutes.js)
│   └── middleware/authMiddleware.js
├── docs/NOTE_MATE_User_Manual.pdf
├── .env.example
├── README.md
└── SETUP.md
```

## How to run (short version)

The React app is already built inside `frontend/dist`, so you only need the backend:

```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
# edit .env: set MONGODB_URI and a long random JWT_SECRET
npm start
```

Then open **http://localhost:5000** in your browser. Full beginner steps are in `SETUP.md`.

### If you want to change the frontend code

```bash
# Terminal 1 - backend
cd backend
npm start

# Terminal 2 - React development server (live reload)
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The development server forwards `/api` requests to the backend on port 5000.

To update the version served at http://localhost:5000 after your changes, run `npm run build` inside `frontend` and refresh the browser.

## API summary

| Method | Route | Purpose |
|--------|-------|---------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Log in |
| GET, POST | /api/notes | List (with `q`, `category`, `important`) or create notes |
| GET, PUT, DELETE | /api/notes/:id | Read, update, delete one note |
| GET, POST | /api/reminders | List (with `q`, `priority`, `status`, `when`, `today`) or create reminders |
| GET, PUT, DELETE | /api/reminders/:id | Read, update, delete one reminder |
| GET | /api/dashboard | Dashboard statistics, recent notes, upcoming reminders |

All note, reminder and dashboard routes need the header `Authorization: Bearer <token>`.

## Notification limitation

Reminder alerts are produced by the web page itself, which checks for due reminders every 30 seconds. They work only while a NOTE-MATE page is open in a browser. If the browser or tab is fully closed, no alert is shown at that moment. When you open the app again, reminders that became due in the meantime are shown once. Alerts when the browser is closed would need a push-notification service, email or SMS, which this simple project does not include.

## Security notes

- Passwords are stored only as bcrypt hashes.
- The `.env` file holds secrets and must never be shared or committed. Only `.env.example` is included.
- Notes and reminders are always queried by the logged-in user's ID.
- The JWT is kept in the browser's `localStorage`, which is fine for a college project but not hardened for production.
