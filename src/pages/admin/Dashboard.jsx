import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isFirebaseConfigured } from '../../firebase/config';
import { seedPortfolioContent } from '../../services/seedService';

export default function AdminDashboard() {
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');
  const [seedErr, setSeedErr] = useState('');
  const [seedProgress, setSeedProgress] = useState(null);

  const handleSeed = async () => {
    if (
      !window.confirm(
        'Importar o conteúdo atual do site (formação, atuação, sobre e projetos com fotos compactadas)? Coleções que já tiverem dados serão ignoradas.'
      )
    ) {
      return;
    }

    setSeeding(true);
    setSeedErr('');
    setSeedMsg('');
    setSeedProgress(null);
    try {
      const report = await seedPortfolioContent({
        onProgress: setSeedProgress,
      });
      const parts = [];
      if (report.formacao) parts.push(`${report.formacao} formações`);
      if (report.atuacao) parts.push(`${report.atuacao} atuações`);
      if (report.sobre) parts.push('sobre');
      if (report.projects) parts.push(`${report.projects} projetos (WebP)`);
      if (report.skipped.length) {
        parts.push(`ignorado (já existia): ${report.skipped.join(', ')}`);
      }
      setSeedMsg(parts.length ? parts.join(' · ') : 'Nada novo para importar.');
    } catch (err) {
      setSeedErr(err.message || 'Falha na importação.');
    } finally {
      setSeeding(false);
      setSeedProgress(null);
    }
  };

  return (
    <>
      <div className="admin-main__head">
        <div>
          <h1>Dashboard</h1>
          <p>CRUD completo do portfólio — edite sem mexer no código.</p>
        </div>
      </div>

      {!isFirebaseConfigured && (
        <div className="admin-alert admin-alert--warn">
          Firebase ainda sem chaves no ambiente local.
        </div>
      )}

      {seedErr && <div className="admin-alert admin-alert--error">{seedErr}</div>}
      {seedMsg && <div className="admin-alert admin-alert--ok">{seedMsg}</div>}

      <div className="admin-form--card">
        <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Primeiro uso</h2>
        <p style={{ color: '#9aa3b2', marginTop: 0 }}>
          Com Auth, Firestore e Storage prontos, importe o conteúdo que já está no site.
          As fotos dos projetos são compactadas para WebP antes de ir ao Storage (economia
          do plano gratuito).
        </p>
        {seedProgress && (
          <p style={{ color: '#f0d49a' }}>
            Compactando projeto {seedProgress.current}/{seedProgress.total}:{' '}
            {seedProgress.title}
          </p>
        )}
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={handleSeed}
          disabled={seeding || !isFirebaseConfigured}
        >
          {seeding ? 'Importando e compactando…' : 'Importar conteúdo atual'}
        </button>
      </div>

      <div className="admin-row" style={{ marginTop: 8 }}>
        <Link
          to="/admin/projetos"
          className="admin-form--card"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <strong>Projetos</strong>
          <p style={{ margin: '8px 0 0', color: '#9aa3b2' }}>
            CRUD + upload com compressão automática.
          </p>
        </Link>
        <Link
          to="/admin/formacao"
          className="admin-form--card"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <strong>Formação</strong>
          <p style={{ margin: '8px 0 0', color: '#9aa3b2' }}>
            Criar, editar e excluir itens da timeline.
          </p>
        </Link>
        <Link
          to="/admin/atuacao"
          className="admin-form--card"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <strong>Área de atuação</strong>
          <p style={{ margin: '8px 0 0', color: '#9aa3b2' }}>
            Frentes profissionais — add / edit / delete.
          </p>
        </Link>
        <Link
          to="/admin/sobre"
          className="admin-form--card"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <strong>Sobre mim</strong>
          <p style={{ margin: '8px 0 0', color: '#9aa3b2' }}>
            Textos, destaques e card de perfil.
          </p>
        </Link>
      </div>
    </>
  );
}
