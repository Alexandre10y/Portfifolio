import { useCallback, useEffect, useState } from 'react';
import {
  listCollection,
  createItem,
  updateItem,
  deleteItem,
} from '../../services/contentService';
import { isFirebaseConfigured } from '../../firebase/config';

const EMPTY = {
  periodo: '',
  titulo: '',
  instituicao: '',
  tipo: 'Pós-graduação',
  detalhes: '',
  tags: '',
  order: 0,
};

export default function FormacaoAdmin() {
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
      setItems(await listCollection('formacao'));
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
      periodo: item.periodo || '',
      titulo: item.titulo || '',
      instituicao: item.instituicao || '',
      tipo: item.tipo || '',
      detalhes: item.detalhes || '',
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
        periodo: form.periodo.trim(),
        titulo: form.titulo.trim(),
        instituicao: form.instituicao.trim(),
        tipo: form.tipo.trim(),
        detalhes: form.detalhes.trim(),
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        order: Number(form.order) || 0,
      };
      if (editingId) {
        await updateItem('formacao', editingId, payload);
        setMessage('Formação atualizada.');
      } else {
        await createItem('formacao', payload);
        setMessage('Formação cadastrada.');
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
      await deleteItem('formacao', item.id);
      if (editingId === item.id) resetForm();
      setMessage('Formação removida.');
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
          <h1>Formação</h1>
          <p>Adicione ou edite itens da timeline de formação e trajetória.</p>
        </div>
        {editingId && (
          <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm}>
            Novo item
          </button>
        )}
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {message && <div className="admin-alert admin-alert--ok">{message}</div>}

      <form className="admin-form admin-form--card" onSubmit={onSubmit}>
        <div className="admin-row">
          <div className="admin-field">
            <label>Título</label>
            <input value={form.titulo} onChange={setField('titulo')} required />
          </div>
          <div className="admin-field">
            <label>Período</label>
            <input value={form.periodo} onChange={setField('periodo')} required />
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label>Instituição</label>
            <input value={form.instituicao} onChange={setField('instituicao')} required />
          </div>
          <div className="admin-field">
            <label>Tipo</label>
            <input
              value={form.tipo}
              onChange={setField('tipo')}
              placeholder="Graduação, Pós-graduação…"
              required
            />
          </div>
        </div>
        <div className="admin-field">
          <label>Detalhes</label>
          <textarea value={form.detalhes} onChange={setField('detalhes')} required />
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label>Tags (separadas por vírgula)</label>
            <input value={form.tags} onChange={setField('tags')} />
          </div>
          <div className="admin-field">
            <label>Ordem</label>
            <input type="number" value={form.order} onChange={setField('order')} />
          </div>
        </div>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
          {saving ? 'Salvando…' : editingId ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      {loading ? (
        <p style={{ color: '#9aa3b2' }}>Carregando…</p>
      ) : items.length === 0 ? (
        <div className="admin-empty">Nenhuma formação no Firebase. Cadastre a primeira acima.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Período</th>
              <th>Título</th>
              <th>Tipo</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.periodo}</td>
                <td>{item.titulo}</td>
                <td>
                  <span className="admin-badge">{item.tipo}</span>
                </td>
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
