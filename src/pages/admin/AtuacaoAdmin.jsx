import { useCallback, useEffect, useState } from 'react';
import {
  listCollection,
  createItem,
  updateItem,
  deleteItem,
} from '../../services/contentService';
import { isFirebaseConfigured } from '../../firebase/config';

const EMPTY = {
  numero: '',
  titulo: '',
  local: '',
  descricao: '',
  tags: '',
  order: 0,
};

export default function AtuacaoAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
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
      setItems(await listCollection('atuacao'));
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
  };

  const onEdit = (item) => {
    setEditingId(item.id);
    setForm({
      numero: item.numero || '',
      titulo: item.titulo || '',
      local: item.local || '',
      descricao: item.descricao || '',
      tags: (item.tags || []).join(', '),
      order: item.order ?? 0,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        numero: form.numero.trim(),
        titulo: form.titulo.trim(),
        local: form.local.trim(),
        descricao: form.descricao.trim(),
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        order: Number(form.order) || 0,
      };
      if (editingId) {
        await updateItem('atuacao', editingId, payload);
        setMessage('Área atualizada.');
      } else {
        await createItem('atuacao', payload);
        setMessage('Área cadastrada.');
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
    if (!window.confirm(`Excluir "${item.titulo}"?`)) return;
    try {
      await deleteItem('atuacao', item.id);
      if (editingId === item.id) resetForm();
      setMessage('Área removida.');
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
          <h1>Área de atuação</h1>
          <p>Edite as frentes profissionais exibidas na home.</p>
        </div>
        {editingId && (
          <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm}>
            Nova área
          </button>
        )}
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {message && <div className="admin-alert admin-alert--ok">{message}</div>}

      <form className="admin-form admin-form--card" onSubmit={onSubmit}>
        <div className="admin-row">
          <div className="admin-field">
            <label>Número (ex: 01)</label>
            <input value={form.numero} onChange={setField('numero')} required />
          </div>
          <div className="admin-field">
            <label>Ordem</label>
            <input type="number" value={form.order} onChange={setField('order')} />
          </div>
        </div>
        <div className="admin-field">
          <label>Título</label>
          <input value={form.titulo} onChange={setField('titulo')} required />
        </div>
        <div className="admin-field">
          <label>Local / contexto</label>
          <input value={form.local} onChange={setField('local')} required />
        </div>
        <div className="admin-field">
          <label>Descrição</label>
          <textarea value={form.descricao} onChange={setField('descricao')} required />
        </div>
        <div className="admin-field">
          <label>Tags (vírgula)</label>
          <input value={form.tags} onChange={setField('tags')} />
        </div>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
          {saving ? 'Salvando…' : editingId ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      {loading ? (
        <p style={{ color: '#9aa3b2' }}>Carregando…</p>
      ) : items.length === 0 ? (
        <div className="admin-empty">Nenhuma área no Firebase. Cadastre a primeira acima.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Local</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.numero}</td>
                <td>{item.titulo}</td>
                <td>{item.local}</td>
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
