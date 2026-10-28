import imageCompression from 'browser-image-compression';

const DEFAULT_OPTIONS = {
  maxSizeMB: 0.35,
  maxWidthOrHeight: 1400,
  useWebWorker: true,
  fileType: 'image/webp',
  initialQuality: 0.78,
};

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Compacta a imagem no navegador antes do upload (WebP, máx ~350KB / 1400px).
 * Mantém o Free Tier do Storage enxuto.
 */
export async function compressImage(file, onProgress) {
  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('Selecione um arquivo de imagem válido.');
  }

  const originalSize = file.size;

  const compressed = await imageCompression(file, {
    ...DEFAULT_OPTIONS,
    onProgress: onProgress
      ? (pct) => onProgress(Math.round(pct))
      : undefined,
  });

  const baseName = (file.name || 'imagem').replace(/\.[^.]+$/, '');
  const webpName = `${baseName}.webp`;
  const outFile =
    compressed instanceof File
      ? new File([compressed], webpName, {
          type: 'image/webp',
          lastModified: Date.now(),
        })
      : new File([compressed], webpName, {
          type: 'image/webp',
          lastModified: Date.now(),
        });

  return {
    file: outFile,
    originalSize,
    compressedSize: outFile.size,
    originalLabel: formatBytes(originalSize),
    compressedLabel: formatBytes(outFile.size),
    savedPercent:
      originalSize > 0
        ? Math.max(0, Math.round((1 - outFile.size / originalSize) * 100))
        : 0,
    previewUrl: URL.createObjectURL(outFile),
  };
}

export { formatBytes };
