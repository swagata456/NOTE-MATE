# NOTE-MATE Setup Guide

Follow these steps in order. No prior experience is needed.

## 1. Install Node.js

1. Go to https://nodejs.org and download the **LTS** version.
2. Install it with the default options.
3. Open a terminal (Command Prompt, PowerShell, or Terminal) and check:

```bash
node -v
npm -v
```

Both commands should print a version number.

## 2. Set up MongoDB (choose ONE option)

### Option A: MongoDB installed on your computer

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community and install it (keep "Install as a Service" ticked on Windows).
2. Make sure the MongoDB service is running.
3. Your connection string will be:

```text
mongodb://127.0.0.1:27017/notemate
```

### Option B: MongoDB Atlas (free cloud database)

1. Create a free account at https://www.mongodb.com/atlas and create a free cluster.
2. Under **Database Access**, create a database user and remember the username and password.
3. Under **Network Access**, add your current IP address (or `0.0.0.0/0` for a college demo).
4. Click **Connect > Drivers** and copy the connection string. It looks like:

```text
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/notemate?retryWrites=true&w=majority
```

Replace `USER` and `PASSWORD` with your own values. If the password contains special characters such as `@`, URL-encode them.

## 3. Open the project folder

Unzip `NOTE-MATE-Personal-Notes-Reminder.zip` and open the `NOTE-MATE` folder in VS Code (or any terminal). The project has two parts:

- `backend` - the server and database code. **This is where you run `npm install` and `npm start`.**
- `frontend` - the React app. It is already built into `frontend/dist`, so you do not need to touch it to run the project.

Open a terminal inside the `backend` folder:

```bash
cd NOTE-MATE/backend
```

## 4. Install dependencies

```bash
npm install
```

## 5. Configure `.env`

Copy the example file:

```bash
# macOS / Linux
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env
```

Open `.env` in any text editor and fill in:

```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/notemate
JWT_SECRET=type_a_long_random_text_here_at_least_32_characters
```

Use your Atlas string for `MONGODB_URI` if you chose Option B.

## 6. Start the backend

```bash
npm start
```

You should see:

```text
MongoDB connected
NOTE-MATE running at http://localhost:5000
```

Keep this terminal open while you use the app.

## 7. Open the frontend

Open **http://localhost:5000** in your browser. The backend also serves the React app, so nothing else needs to be started. Do not open files from the `frontend` folder directly; always use this address.

## 8. Register an account

Click **Register**, enter your name, email, password (at least 6 characters) and the same password again. You are taken to the dashboard.

## 9. Use Notes

Open **Notes**, click **New Note**, fill in the title, content, category and tags, and click **Save Note**. Use the search box to find notes, and the buttons on each card to view, edit, mark important or delete.

## 10. Use Reminders

Open **Reminders**, click **New Reminder**, choose a date, time and priority, and click **Save Reminder**. Click **Enable alerts** in the top bar and allow notifications when your browser asks. Keep a NOTE-MATE page open so the alert can appear at the reminder time.

---

## Optional: changing the React frontend

You only need this if you want to edit the frontend code in `frontend/src`.

**Live-reload development** (two terminals):

```bash
# Terminal 1 (already running from step 6)
cd backend
npm start

# Terminal 2
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Changes you save appear instantly. Requests to `/api` are forwarded to the backend on port 5000, so the backend must be running.

**Updating the version served on port 5000:**

```bash
cd frontend
npm install
npm run build
```

Then refresh http://localhost:5000. (If the `frontend/dist` folder is ever missing, this same command recreates it.)

---

## Common errors and solutions

| Problem | Solution |
|---------|----------|
| `Missing MONGODB_URI or JWT_SECRET` | You have not created `.env`. Copy `.env.example` to `.env` and fill it in (step 5). |
| `MongoDB connection failed` (local) | MongoDB is not running. Start the MongoDB service, then run `npm start` again. |
| `MongoDB connection failed` (Atlas) | Check the username and password, URL-encode special characters, and add your IP in Network Access. |
| `EADDRINUSE: address already in use` | Port 5000 is taken. Change `PORT` in `.env` (for example 5001) and open that port instead. |
| Browser shows "Frontend not built yet" | The `frontend/dist` folder is missing. Run `npm install` then `npm run build` inside the `frontend` folder. |
| `npm install` in `frontend` fails with ENOENT (no package.json) | You are in the wrong folder. Check with `pwd` / `cd` that you are inside `NOTE-MATE/frontend` (it contains `package.json`). |
| `npm: command not found` | Node.js is not installed or the terminal was not reopened after installing. |
| Page says "Cannot reach the server" | The backend is not running. Open a terminal in `backend`, run `npm start`, and keep it open. |
| "This email is already registered" | Log in instead, or register with a different email. |
| Browser alerts never appear | Click **Enable alerts**, allow notifications in the browser, and keep a NOTE-MATE page open. Alerts cannot show if the browser is closed. |
| Page at http://localhost:5173 loads but nothing works | The backend is not running. Start it with `npm start` in the `backend` folder. |
| Logged out suddenly | The login lasts 7 days, or `JWT_SECRET` was changed. Log in again. |
