import { useCallback, useEffect, useState } from 'react';
import {
  listCollection,
  createItem,
  updateItem,
  deleteItem,
  uploadProjectImage,
  deleteStoragePath,
} from '../../services/contentService';
import { isFirebaseConfigured } from '../../firebase/config';
import ImageUploadField from '../../components/admin/ImageUploadField';

const EMPTY = {
  title: '',
  subtitle: '',
  type: 'empresarial',
  url: '',
  handle: '@Alexandre10y',
  borderColor: '#10B981',
  gradient: 'linear-gradient(210deg, #10B981, #000)',
  order: 0,
  imageUrl: '',
  imagePath: '',
};

export default function ProjectsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [compressMeta, setCompressMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setItems(await listCollection('projects'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId(null);
    setCompressedFile(null);
    setCompressMeta(null);
  };

  const onEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      type: item.type || 'empresarial',
      url: item.url || '',
      handle: item.handle || '',
      borderColor: item.borderColor || '#10B981',
      gradient: item.gradient || 'linear-gradient(210deg, #10B981, #000)',
      order: item.order ?? 0,
      imageUrl: item.imageUrl || '',
      imagePath: item.imagePath || '',
    });
    setCompressedFile(null);
    setCompressMeta(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      let imageUrl = form.imageUrl;
      let imagePath = form.imagePath;

      if (compressedFile) {
        const uploaded = await uploadProjectImage(compressedFile, editingId || 'draft', {
          alreadyCompressed: true,
          meta: compressMeta,
        });
        if (imagePath) await deleteStoragePath(imagePath);
        imageUrl = uploaded.url;
        imagePath = uploaded.path;
        setMessage(
          `Projeto salvo. Imagem: ${uploaded.originalLabel || '?'} → ${uploaded.compressedLabel} (−${uploaded.savedPercent}%).`
        );
      }

      if (!imageUrl) {
        throw new Error('Selecione e compacte uma imagem para o projeto.');
      }

      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        type: form.type,
        url: form.url.trim(),
        handle: form.handle.trim(),
        borderColor: form.borderColor,
        gradient: form.gradient,
        order: Number(form.order) || 0,
        imageUrl,
        imagePath,
      };

      if (editingId) {
        await updateItem('projects', editingId, payload);
        if (!compressedFile) setMessage('Projeto atualizado.');
      } else {
        await createItem('projects', payload);
        if (!compressedFile) setMessage('Projeto cadastrado.');
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (item) => {
    if (!window.confirm(`Excluir "${item.title}"?`)) return;
    try {
      await deleteItem('projects', item.id);
      if (item.imagePath) await deleteStoragePath(item.imagePath);
      if (editingId === item.id) resetForm();
      setMessage('Projeto removido.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <div className="admin-main__head">
        <div>
          <h1>Projetos</h1>
          <p>
            CRUD completo — cadastre, edite ou remova projetos empresariais e pessoais. Fotos
            são compactadas antes do Storage.
          </p>
        </div>
        {editingId && (
          <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm}>
            Novo projeto
          </button>
        )}
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {message && <div className="admin-alert admin-alert--ok">{message}</div>}

      <form className="admin-form admin-form--card" onSubmit={onSubmit}>
        <div className="admin-row">
          <div className="admin-field">
            <label>Título</label>
            <input value={form.title} onChange={setField('title')} required />
          </div>
          <div className="admin-field">
            <label>Tipo</label>
            <select value={form.type} onChange={setField('type')}>
              <option value="empresarial">Empresarial</option>
              <option value="pessoal">Pessoal</option>
            </select>
          </div>
        </div>
        <div className="admin-field">
          <label>O que foi feito / subtítulo</label>
          <textarea value={form.subtitle} onChange={setField('subtitle')} required />
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label>Link do projeto</label>
            <input value={form.url} onChange={setField('url')} placeholder="https://" />
          </div>
          <div className="admin-field">
            <label>Handle</label>
            <input value={form.handle} onChange={setField('handle')} />
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label>Cor da borda</label>
            <input value={form.borderColor} onChange={setField('borderColor')} />
          </div>
          <div className="admin-field">
            <label>Ordem</label>
            <input type="number" value={form.order} onChange={setField('order')} />
          </div>
        </div>
        <div className="admin-field">
          <label>Gradiente CSS</label>
          <input value={form.gradient} onChange={setField('gradient')} />
        </div>

        <ImageUploadField
          existingUrl={form.imageUrl}
          onReady={(file, meta) => {
            setCompressedFile(file);
            setCompressMeta(meta);
          }}
          onClear={() => {
            setCompressedFile(null);
            setCompressMeta(null);
          }}
        />

        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Salvando…' : editingId ? 'Atualizar projeto' : 'Cadastrar projeto'}
          </button>
        </div>
      </form>

      {loading ? (
        <p style={{ color: '#9aa3b2' }}>Carregando projetos…</p>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          Nenhum projeto no Firebase. Cadastre acima ou use “Importar conteúdo atual” no
          Dashboard.
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Ordem</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.imageUrl ? (
                    <img className="admin-thumb" src={item.imageUrl} alt="" />
                  ) : (
                    '—'
                  )}
                </td>
                <td>{item.title}</td>
                <td>
                  <span className="admin-badge">{item.type}</span>
                </td>
                <td>{item.order ?? 0}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      onClick={() => onEdit(item)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger"
                      onClick={() => onDelete(item)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
