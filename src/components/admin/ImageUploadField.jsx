import { useEffect, useState } from 'react';
import { compressImage, formatBytes } from '../../utils/compressImage';

/**
 * Seleção de imagem com compactação imediata e prévia do ganho de tamanho.
 */
export default function ImageUploadField({
  label = 'Foto',
  existingUrl,
  onReady,
  onClear,
}) {
  const [preview, setPreview] = useState(existingUrl || '');
  const [meta, setMeta] = useState(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!meta) setPreview(existingUrl || '');
  }, [existingUrl, meta]);

  useEffect(() => {
    return () => {
      if (meta?.previewUrl) URL.revokeObjectURL(meta.previewUrl);
    };
  }, [meta]);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setBusy(true);
    setError('');
    setProgress(0);
    try {
      const result = await compressImage(file, setProgress);
      if (meta?.previewUrl) URL.revokeObjectURL(meta.previewUrl);
      setMeta(result);
      setPreview(result.previewUrl);
      onReady?.(result.file, result);
    } catch (err) {
      setError(err.message || 'Falha ao compactar a imagem.');
      onReady?.(null, null);
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const handleClear = () => {
    if (meta?.previewUrl) URL.revokeObjectURL(meta.previewUrl);
    setMeta(null);
    setPreview(existingUrl || '');
    onClear?.();
    onReady?.(null, null);
  };

  return (
    <div className="admin-field admin-image-field">
      <label>{label}</label>
      <p className="admin-image-field__hint">
        Compactamos automaticamente para WebP (~350KB / 1400px) antes de enviar ao Storage.
      </p>
      <input type="file" accept="image/*" onChange={handleChange} disabled={busy} />

      {busy && (
        <div className="admin-image-field__progress" role="status">
          <div className="admin-image-field__bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <small>Compactando… {progress}%</small>
        </div>
      )}

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {preview && (
        <div className="admin-image-field__preview">
          <img src={preview} alt="Prévia compactada" />
          <div className="admin-image-field__stats">
            {meta ? (
              <>
                <span>
                  Original: <strong>{meta.originalLabel}</strong>
                </span>
                <span>
                  Compactada: <strong>{meta.compressedLabel}</strong>
                </span>
                <span className="admin-image-field__saved">
                  −{meta.savedPercent}% no Storage
                </span>
              </>
            ) : (
              <span>Imagem atual no Firebase</span>
            )}
            {(meta || existingUrl) && (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={handleClear}>
                Limpar seleção
              </button>
            )}
          </div>
        </div>
      )}

      {!preview && !busy && (
        <small className="admin-image-field__empty">
          Nenhuma imagem selecionada · tamanho livre típico {formatBytes(350 * 1024)}
        </small>
      )}
    </div>
  );
}
