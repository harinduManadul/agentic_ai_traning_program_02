import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin } = useAuth();

  return (
    <header className="navbar" data-testid="navbar">
      <div className="navbar-brand" data-testid="navbar-brand">
        <span className="navbar-logo">Online Store</span>
      </div>

      <div className="navbar-actions" data-testid="navbar-actions">
        {isAdmin && <span className="badge badge-admin" data-testid="admin-badge">Admin</span>}
        <span className="navbar-user" data-testid="navbar-user">
          {user ? user.name : 'Guest'}
        </span>
      </div>
    </header>
  );
}
