import { Link } from 'react-router-dom';
import './Home.css';

const FEATURES = [
  {
    icon: '📝',
    title: 'Notes',
    text: 'Create, edit and delete personal notes in clean cards.',
    className: 'purple',
  },
  {
    icon: '🔔',
    title: 'Reminders',
    text: 'Set a date, time and priority for tasks you must remember.',
    className: 'pink',
  },
  {
    icon: '🔍',
    title: 'Search',
    text: 'Find any note or reminder instantly as you type.',
    className: 'green',
  },
  {
    icon: '📁',
    title: 'Categories',
    text: 'Group notes into College, Work, Personal, Project and more.',
    className: 'yellow',
  },
  {
    icon: '⭐',
    title: 'Important Notes',
    text: 'Star key notes so they always appear first.',
    className: 'blue',
  },
  {
    icon: '🔔',
    title: 'Notifications',
    text: 'Get an alert when a reminder time arrives.',
    className: 'purple',
  },
];

export default function Home() {
  return (
    <div className="note-mate-home">

      {/* ================= NAVBAR ================= */}
      <nav className="nm-navbar">
        <div className="nm-nav-container">

          <Link to="/" className="nm-brand">
            <span className="brand-icon">📝</span>
            <span>NOTE-<strong>MATE</strong></span>
          </Link>

          <div className="nm-nav-links">
            <Link to="/" className="active">
              Home
            </Link>

            <a href="#about">
              About
            </a>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </div>

        </div>
      </nav>


      {/* ================= HERO SECTION ================= */}
      <section className="nm-hero">

        {/* Decorative background */}
        <div className="hero-circle circle-one"></div>
        <div className="hero-circle circle-two"></div>
        <div className="hero-circle circle-three"></div>

        <div className="hero-container">

          {/* LEFT CONTENT */}
          <div className="hero-content">

            <div className="welcome-text">
              <span className="welcome-line"></span>
              Welcome to
            </div>

            <h1 className="hero-brand">
              NOTE-<span>MATE</span>
            </h1>

            <h2>
              Manage your notes and
              <br />
              reminders easily
            </h2>

            <p className="hero-description">
              A simple personal notebook and reminder app.
              Write notes, organize them with categories and tags,
              and never miss an important task.
            </p>

            <div className="hero-buttons">

              <Link
                to="/register"
                className="hero-btn primary-btn"
              >
                Get Started
                <span>→</span>
              </Link>

              <Link
                to="/login"
                className="hero-btn secondary-btn"
              >
                <span>🔐</span>
                Login
              </Link>

              <Link
                to="/register"
                className="hero-btn secondary-btn"
              >
                <span>👤</span>
                Register
              </Link>

            </div>

          </div>


          {/* RIGHT NOTEBOOK ILLUSTRATION */}
          <div className="hero-illustration">

            {/* floating sticky note */}
            <div className="sticky-note study-note">
              <div>☑ Study</div>
              <div>☑ Work</div>
              <div>☑ Goals</div>
              <div>☑ Dreams</div>
            </div>

            {/* alarm clock */}
            <div className="alarm-clock">
              <div className="clock-top-left"></div>
              <div className="clock-top-right"></div>

              <div className="clock-face">
                <div className="clock-hand hour-hand"></div>
                <div className="clock-hand minute-hand"></div>
                <div className="clock-center"></div>
              </div>

              <div className="clock-leg left-leg"></div>
              <div className="clock-leg right-leg"></div>
            </div>

            {/* notebook */}
            <div className="notebook">

              <div className="notebook-rings">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="notebook-paper">

                <div className="paper-line small-line"></div>

                <div className="paper-text">
                  Small notes
                  <br />
                  <strong>Big plans ♥</strong>
                </div>

                <div className="paper-underline"></div>

              </div>

            </div>


            {/* Pens */}
            <div className="pen-holder">

              <div className="pen pen-blue"></div>
              <div className="pen pen-pink"></div>
              <div className="pen pen-yellow"></div>

              <div className="pen-cup">
                <span>✎</span>
              </div>

            </div>


            {/* Books */}
            <div className="books">

              <div className="book book-blue">
                <span>Notes</span>
              </div>

              <div className="book book-pink">
                <span>Reminders</span>
              </div>

              <div className="book book-green">
                <span>Better You</span>
              </div>

            </div>


            {/* Right sticky note */}
            <div className="sticky-note reminder-note">
              <span>Don't</span>
              <br />
              <strong>forget!</strong>
              <div className="note-line"></div>
            </div>


            {/* Heart decoration */}
            <div className="heart-decoration">♡</div>

            {/* Plant */}
            <div className="plant">
              <div className="plant-stem"></div>
              <div className="leaf leaf-one"></div>
              <div className="leaf leaf-two"></div>
              <div className="leaf leaf-three"></div>
              <div className="leaf leaf-four"></div>
            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES SECTION ================= */}
      <section
        className="nm-features"
        id="about"
      >

        <div className="features-heading">

          <div className="heading-decoration">
            <span>✦</span>
          </div>

          <h2>Everything you need</h2>

          <div className="heading-decoration">
            <span>✦</span>
          </div>

        </div>

        <p className="features-subtitle">
          All the features you need to stay organized and productive.
        </p>


        <div className="features-grid">

          {FEATURES.map((feature) => (
            <div
              className={`feature-card ${feature.className}`}
              key={feature.title}
            >

              <div className={`feature-icon ${feature.className}`}>
                {feature.icon}
              </div>

              <div className="feature-content">

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>

              </div>

            </div>
          ))}

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="nm-footer">
        <p>
          NOTE-MATE - Personal Notes &amp; Reminder
          <span> ♡</span>
        </p>
      </footer>

    </div>
  );
}