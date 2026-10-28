import { useEffect, useState } from 'react';
import { getSiteContent, saveSiteContent } from '../../services/contentService';
import { DEFAULT_SOBRE } from '../../data/defaults';
import { isFirebaseConfigured } from '../../firebase/config';

export default function SobreAdmin() {
  const [form, setForm] = useState({
    headline: DEFAULT_SOBRE.headline,
    cardName: DEFAULT_SOBRE.cardName,
    cardTitle: DEFAULT_SOBRE.cardTitle,
    cardHandle: DEFAULT_SOBRE.cardHandle,
    paragraphsText: DEFAULT_SOBRE.paragraphs.join('\n\n'),
    highlightsText: DEFAULT_SOBRE.highlights.join('\n'),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isFirebaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const remote = await getSiteContent('sobre');
        if (cancelled || !remote) return;
        setForm({
          headline: remote.headline || DEFAULT_SOBRE.headline,
          cardName: remote.cardName || DEFAULT_SOBRE.cardName,
          cardTitle: remote.cardTitle || DEFAULT_SOBRE.cardTitle,
          cardHandle: remote.cardHandle || DEFAULT_SOBRE.cardHandle,
          paragraphsText: (remote.paragraphs || DEFAULT_SOBRE.paragraphs).join('\n\n'),
          highlightsText: (remote.highlights || DEFAULT_SOBRE.highlights).join('\n'),
        });
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const paragraphs = form.paragraphsText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      const highlights = form.highlightsText
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean);

      await saveSiteContent('sobre', {
        headline: form.headline.trim(),
        cardName: form.cardName.trim(),
        cardTitle: form.cardTitle.trim(),
        cardHandle: form.cardHandle.trim(),
        paragraphs,
        highlights,
      });
      setMessage('Seção Sobre salva no Firebase.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ color: '#9aa3b2' }}>Carregando…</p>;
  }

  return (
    <>
      <div className="admin-main__head">
        <div>
          <h1>Sobre mim</h1>
          <p>
            Use **texto** para negrito nos parágrafos. Separe parágrafos com uma linha em
            branco.
          </p>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {message && <div className="admin-alert admin-alert--ok">{message}</div>}

      <form className="admin-form admin-form--card" onSubmit={onSubmit}>
        <div className="admin-field">
          <label>Título da seção</label>
          <input value={form.headline} onChange={setField('headline')} required />
        </div>
        <div className="admin-field">
          <label>Parágrafos</label>
          <textarea
            style={{ minHeight: 220 }}
            value={form.paragraphsText}
            onChange={setField('paragraphsText')}
            required
          />
        </div>
        <div className="admin-field">
          <label>Destaques (um por linha)</label>
          <textarea
            style={{ minHeight: 120 }}
            value={form.highlightsText}
            onChange={setField('highlightsText')}
          />
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label>Nome no card</label>
            <input value={form.cardName} onChange={setField('cardName')} />
          </div>
          <div className="admin-field">
            <label>Cargo no card</label>
            <input value={form.cardTitle} onChange={setField('cardTitle')} />
          </div>
        </div>
        <div className="admin-field">
          <label>Handle no card</label>
          <input value={form.cardHandle} onChange={setField('cardHandle')} />
        </div>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar Sobre'}
        </button>
      </form>
    </>
  );
}
