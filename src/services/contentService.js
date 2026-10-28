import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../firebase/config';
import { compressImage } from '../utils/compressImage';

function ensureDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase não configurado. Preencha o arquivo .env.local.');
  }
  return db;
}

function sortByOrder(items) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function listCollection(name) {
  const database = ensureDb();
  try {
    const snap = await getDocs(query(collection(database, name), orderBy('order', 'asc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    const snap = await getDocs(collection(database, name));
    return sortByOrder(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }
}

export async function createItem(name, data) {
  const database = ensureDb();
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const refDoc = await addDoc(collection(database, name), payload);
  return { id: refDoc.id, ...data };
}

export async function updateItem(name, id, data) {
  const database = ensureDb();
  await updateDoc(doc(database, name, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return { id, ...data };
}

export async function deleteItem(name, id) {
  const database = ensureDb();
  await deleteDoc(doc(database, name, id));
}

export async function getSiteContent(docId) {
  const database = ensureDb();
  const snap = await getDoc(doc(database, 'siteContent', docId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function saveSiteContent(docId, data) {
  const database = ensureDb();
  await setDoc(
    doc(database, 'siteContent', docId),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return { id: docId, ...data };
}

export async function uploadProjectImage(
  file,
  projectId,
  { alreadyCompressed = false, onProgress, meta } = {}
) {
  if (!isFirebaseConfigured || !storage) {
    throw new Error('Firebase Storage não configurado.');
  }

  const prepared = alreadyCompressed
    ? {
        file,
        originalSize: meta?.originalSize,
        compressedSize: meta?.compressedSize ?? file.size,
        originalLabel: meta?.originalLabel,
        compressedLabel: meta?.compressedLabel,
        savedPercent: meta?.savedPercent,
      }
    : await compressImage(file, onProgress);

  const safeName = prepared.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `projects/${projectId || 'new'}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, prepared.file, {
    contentType: prepared.file.type || 'image/webp',
    cacheControl: 'public,max-age=31536000',
  });

  const url = await getDownloadURL(storageRef);
  return {
    url,
    path,
    originalSize: prepared.originalSize,
    compressedSize: prepared.compressedSize,
    originalLabel: prepared.originalLabel,
    compressedLabel: prepared.compressedLabel,
    savedPercent: prepared.savedPercent,
  };
}

export async function deleteStoragePath(path) {
  if (!path || !storage) return;
  try {
    await deleteObject(ref(storage, path));
  } catch {
    // arquivo já removido ou path inválido
  }
}

export async function fetchProjects() {
  try {
    if (!isFirebaseConfigured) return null;
    const items = await listCollection('projects');
    return sortByOrder(items);
  } catch {
    return null;
  }
}

export async function fetchFormacao() {
  try {
    if (!isFirebaseConfigured) return null;
    return await listCollection('formacao');
  } catch {
    return null;
  }
}

export async function fetchAtuacao() {
  try {
    if (!isFirebaseConfigured) return null;
    return await listCollection('atuacao');
  } catch {
    return null;
  }
}

export async function fetchSobre() {
  try {
    if (!isFirebaseConfigured) return null;
    return await getSiteContent('sobre');
  } catch {
    return null;
  }
}
