export default function About() {
  return (
    <>
      <main className="container">
        <h1 style={{ marginBottom: 16 }}>About NOTE-MATE</h1>

        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ marginBottom: 6 }}>What is NOTE-MATE?</h2>
          <p>
            NOTE-MATE is a simple personal notes and reminder web application. You can write notes, organize them with
            categories and tags, mark important ones, and create reminders with a date, time and priority. Each user
            only sees their own data.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ marginBottom: 6 }}>Technologies</h2>
          <p>
            Frontend: React (with Vite and React Router), HTML5, CSS3.<br />
            Backend: Node.js, Express.js.<br />
            Database: MongoDB with Mongoose.<br />
            Security: bcrypt password hashing and JWT login tokens.
          </p>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: 6 }}>About reminder notifications</h2>
          <p>
            Reminder alerts appear while a NOTE-MATE page is open in your browser (the app checks every 30 seconds). If
            you allow browser notifications, you also get a system notification. If the browser or the tab is
            completely closed, no alert can be shown. When you open the app again, any reminders that became due while
            you were away are shown once.
          </p>
        </div>
      </main>
      <footer>NOTE-MATE - Personal Notes &amp; Reminder</footer>
    </>
  );
}
