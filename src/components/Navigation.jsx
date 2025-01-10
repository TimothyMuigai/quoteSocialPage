import { Link } from "react-router-dom";
import { useState } from "react";

function Navigation() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-theme", !darkMode);
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-link">Home page</Link>
        <Link to="/QuoteAccount" className="nav-link">My quotes</Link>
        <Link to="/login" className="nav-link">Login page</Link>
        <Link to="/sign-up" className="nav-link">Sign up page</Link>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </nav>
    </header>
  );
}

export default Navigation;
