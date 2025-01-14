import { Link } from "react-router-dom";
function Navigation() {

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-link">Home page</Link>
        <Link to="/QuoteAccount" className="nav-link">My quotes</Link>
        <Link to="/login" className="nav-link">Login page</Link>
        <Link to="/sign-up" className="nav-link">Sign up page</Link>
      </nav>
    </header>
  );
}

export default Navigation;
