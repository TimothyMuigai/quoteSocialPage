import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="not-found-container">
        <h2 className="not-found-title">404, Page Not Found!</h2>
        <p className="not-found-message">The page you are looking for was not found</p>
        <Link to="/" className="home-link">
          <button className="return-home-button">Return to home page</button>
        </Link>
    </div>
  )
}

export default NotFound
