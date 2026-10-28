import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './admin.css';

export default function AdminLogin() {
  const { user, loading, login, configured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (err) {
      setError(err?.message || 'Falha no login. Verifique e-mail e senha.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-shell admin-login">
      <div className="admin-login__card">
        <h1>Painel do portfólio</h1>
        <p>Acesso exclusivo — use o usuário criado no Firebase Authentication.</p>

        {!configured && (
          <div className="admin-alert admin-alert--warn">
            Configure o <code>.env.local</code> com as chaves do Firebase antes de entrar.
          </div>
        )}

        {error && <div className="admin-alert admin-alert--error">{error}</div>}

        <form className="admin-form" onSubmit={onSubmit}>
          <div className="admin-field">
            <label htmlFor="admin-email">E-mail</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!configured}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="admin-password">Senha</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!configured}
            />
          </div>
          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={submitting || !configured}
          >
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
