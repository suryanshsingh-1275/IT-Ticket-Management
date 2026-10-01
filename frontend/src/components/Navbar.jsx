import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function linkClass({ isActive }) {
    return isActive ? 'nav-link active' : 'nav-link';
  }

  return (
    <nav className="app-nav" style={{ position: 'relative' }}>
      <div className="container">
        <Link to="/" className="brand">Nettech Help Desk</Link>

        {user && (
          <>
            <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              &#9776;
            </button>

            <div className={menuOpen ? 'nav-collapse open' : 'nav-collapse'}>
              <div className="nav-links">
                {user.role === 'admin' ? (
                  <>
                    <NavLink end to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
                    <NavLink to="/admin/tickets" className={linkClass} onClick={() => setMenuOpen(false)}>All tickets</NavLink>
                  </>
                ) : (
                  <>
                    <NavLink end to="/tickets" className={linkClass} onClick={() => setMenuOpen(false)}>My tickets</NavLink>
                    <NavLink to="/tickets/new" className={linkClass} onClick={() => setMenuOpen(false)}>Raise ticket</NavLink>
                  </>
                )}
              </div>

              <div className="nav-right">
                <Link to="/profile" className="nav-user" onClick={() => setMenuOpen(false)}>
                  <Avatar user={user} size={30} />
                  <span>{user.name}</span>
                </Link>
                <button className="btn btn-sm btn-ghost-light" onClick={handleLogout}>Log out</button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}