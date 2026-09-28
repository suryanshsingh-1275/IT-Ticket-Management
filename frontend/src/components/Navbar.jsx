import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  eturn (
    <nav className="navbar navbar-expand-md app-nav navbar-dark">
      <div className="container">
        <Link to="/" className="brand navbar-brand">Nettech Help Desk</Link>
        {user && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNav"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="mainNav">
              <ul className="navbar-nav me-auto">
                {user.role === 'admin' ? (
                  <>
                    <li className="nav-item"><NavLink end to="/admin" className="nav-link">Dashboard</NavLink></li>
                    <li className="nav-item"><NavLink to="/admin/tickets" className="nav-link">All tickets</NavLink></li>
                  </>
                ) : (
                  <>
                    <li className="nav-item"><NavLink end to="/tickets" className="nav-link">My tickets</NavLink></li>
                    <li className="nav-item"><NavLink to="/tickets/new" className="nav-link">Raise ticket</NavLink></li>
                  </>
                )}
              </ul>
              <div className="d-flex align-items-center gap-3">
                <Link to="/profile" className="d-flex align-items-center gap-2 text-decoration-none text-white">
                  <Avatar user={user} size={30} />
                  <span>{user.name}</span>
                </Link>
                <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>Log out</button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}