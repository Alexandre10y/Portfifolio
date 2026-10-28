import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './admin.css';

const LINKS = [
  { to: '/admin', end: true, label: 'Dashboard' },
  { to: '/admin/projetos', label: 'Projetos' },
  { to: '/admin/formacao', label: 'Formação' },
  { to: '/admin/atuacao', label: 'Área de atuação' },
  { to: '/admin/sobre', label: 'Sobre mim' },
];

export default function AdminLayout() {
  const { user, loading, logout, configured } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="admin-shell admin-login">
        <p style={{ color: '#9aa3b2' }}>Carregando…</p>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="admin-shell admin-login">
        <div className="admin-login__card">
          <h1>Firebase não configurado</h1>
          <p>
            Copie <code>.env.example</code> para <code>.env.local</code>, preencha as chaves
            do Console e reinicie o <code>npm start</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__brand">
            Portfólio <span>Admin</span>
          </div>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' is-active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="admin-sidebar__footer">
            <span className="admin-sidebar__email">{user.email}</span>
            <a className="admin-nav-link" href="/" target="_blank" rel="noreferrer">
              Ver site
            </a>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </aside>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
