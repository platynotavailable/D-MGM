import { useState } from "react";
import LiveMap from "./components/LiveMap";
import "./App.css";

const DEMO_USERNAME = "user";
const DEMO_PASSWORD = "user@123";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) {
    return (
      <main className="app">
        <Dashboard onLogout={() => setLoggedIn(false)} />
      </main>
    );
  }

  return (
    <main className="app">
      <Login onLogin={() => setLoggedIn(true)} />
    </main>
  );
}

type LoginProps = { onLogin: () => void };

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setError("Please enter your username and password.");
      return;
    }

    setIsLoggingIn(true);

    if (cleanUsername === DEMO_USERNAME && cleanPassword === DEMO_PASSWORD) {
      window.setTimeout(() => {
        setIsLoggingIn(false);
        onLogin();
      }, 350);
      return;
    }

    window.setTimeout(() => {
      setIsLoggingIn(false);
      setError("Invalid username or password.");
    }, 350);
  };

  return (
    <section className="login-page">
      <div className="login-earth" />
      <div className="login-atmosphere" />
      <div className="login-overlay" />
      <div className="login-cloud-layer">
        <div className="login-cloud login-cloud-one" />
        <div className="login-cloud login-cloud-two" />
        <div className="login-cloud login-cloud-three" />
        <div className="login-cloud login-cloud-four" />
        <div className="login-cloud login-cloud-five" />
      </div>
      <div className="login-grid" />

      <div className="login-container">
        <div className="login-brand">
          <div className="brand-mark"><span /><span /><span /></div>
          <div>
            <div className="login-brand-title">D-MGM</div>
            <div className="login-brand-subtitle">
              DISASTER MANAGEMENT <span> &amp; </span> INFRASTRUCTURE MONITORING
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-header">
            <div className="login-eyebrow">SECURE OPERATIONS PORTAL</div>
            <h1>Welcome back</h1>
            <p>Sign in to access the D-MGM disaster intelligence platform.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" type="text" value={username} onChange={(event) => { setUsername(event.target.value); setError(""); }} placeholder="Enter username" autoComplete="username" autoFocus />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Enter password" autoComplete="current-password" />
            </div>
            {error && <div className="login-error"><span className="error-dot" />{error}</div>}
            <button type="submit" className="login-button" disabled={isLoggingIn}>
              {isLoggingIn ? <><span className="button-spinner" />AUTHENTICATING</> : <>LOGIN <span className="button-arrow">→</span></>}
            </button>
          </form>

          <div className="demo-access">
            <div className="demo-access-header"><span className="demo-line" /><span>DEMO ACCESS</span><span className="demo-line" /></div>
            <div className="credential-row"><span>Username</span><strong>user</strong></div>
            <div className="credential-row"><span>Password</span><strong>user@123</strong></div>
          </div>
        </div>

        <div className="login-footer"><span>D-MGM</span><span className="footer-separator">•</span><span>DISASTER INTELLIGENCE PLATFORM</span><span className="footer-separator">•</span><span>DEMO ENVIRONMENT</span></div>
      </div>

      <div className="earth-info"><div className="earth-info-line" /><div><div className="earth-info-title">PLANETARY MONITORING</div><div className="earth-info-subtitle">REAL-TIME INFRASTRUCTURE INTELLIGENCE</div></div></div>
      <div className="login-status"><span className="status-indicator" />PLATFORM READY</div>
    </section>
  );
}

type DashboardProps = { onLogout: () => void };

function Dashboard({ onLogout }: DashboardProps) {
  return (
    <section className="dashboard">
      <LiveMap />

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-brand-title">D-MGM</div>
          <div className="dashboard-brand-subtitle">DISASTER MANAGEMENT &amp; INFRASTRUCTURE MONITORING</div>
        </div>
        <div className="dashboard-header-right">
          <div className="dashboard-status"><span className="dashboard-status-dot" />SYSTEM ONLINE</div>
          <button className="logout-button" onClick={onLogout}>LOGOUT</button>
        </div>
      </header>

      <aside className="dashboard-sidebar">
        <div className="sidebar-section-label">OPERATIONS</div>
        <button className="sidebar-item active"><span className="sidebar-icon">01</span>Overview</button>
        <button className="sidebar-item"><span className="sidebar-icon">02</span>Incidents</button>
        <button className="sidebar-item"><span className="sidebar-icon">03</span>Infrastructure</button>
        <button className="sidebar-item"><span className="sidebar-icon">04</span>Risk Analysis</button>
        <button className="sidebar-item"><span className="sidebar-icon">05</span>Evacuation</button>
        <div className="sidebar-divider" />
        <div className="sidebar-section-label">SYSTEM</div>
        <button className="sidebar-item"><span className="sidebar-icon">06</span>Simulation</button>
      </aside>

      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <div className="dashboard-eyebrow">CONTROL CENTER</div>
          <h1>Disaster Intelligence</h1>
          <p>Monitor critical infrastructure, incidents and emerging risks from one operational view.</p>
        </div>
        <div className="dashboard-summary">
          <div className="summary-card"><span className="summary-label">ACTIVE INCIDENTS</span><strong>01</strong><span className="summary-status">Kingfisher Towers • HIGH</span></div>
          <div className="summary-card"><span className="summary-label">INFRASTRUCTURE</span><strong>READY</strong><span className="summary-status">Monitoring available</span></div>
          <div className="summary-card"><span className="summary-label">AI ENGINE</span><strong>READY</strong><span className="summary-status">Intelligence layer online</span></div>
        </div>
        <div className="dashboard-notice">
          <div className="notice-indicator" />
          <div><div className="notice-title">ACTIVE RESPONSE</div><div className="notice-text">Structural fire detected at Kingfisher Towers. Live map, risk analysis and evacuation intelligence are being prepared for the incident command view.</div></div>
        </div>
      </div>
    </section>
  );
}

export default App;
