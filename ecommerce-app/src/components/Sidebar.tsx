import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'Products', icon: '📦' },
  { to: '/offers', label: 'Offers', icon: '🏷️' },
  { to: '/cart', label: 'Cart', icon: '🛒' },
  { to: '/orders', label: 'Orders', icon: '📋' },
];

const adminItems = [
  { to: '/admin/products', label: 'Manage Products', icon: '🛠️' },
  { to: '/admin/offers', label: 'Manage Offers', icon: '✨' },
  { to: '/admin/orders', label: 'Manage Orders', icon: '📑' },
];

export default function Sidebar() {
  const { logout, isAdmin } = useAuth();

  return (
    <aside className="sidebar" data-testid="sidebar">
      <div className="sidebar-brand" data-testid="sidebar-brand">
        <span className="brand-text">Online Store</span>
      </div>

      <nav className="sidebar-nav" data-testid="sidebar-nav" aria-label="Main navigation">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {isAdmin && (
          <>
            <div className="sidebar-divider" />
            <p className="sidebar-section-title">Admin Panel</p>
            <ul>
              {adminItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    <span className="sidebar-label">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      <div className="sidebar-footer" data-testid="sidebar-footer">
        <button className="btn btn-outline btn-sm" data-testid="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
