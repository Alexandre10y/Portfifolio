import { useEffect, useState } from 'react';
import {
  DEFAULT_PROJECTS,
  DEFAULT_FORMACAO,
  DEFAULT_ATUACAO,
  DEFAULT_SOBRE,
} from '../data/defaults';
import {
  fetchProjects,
  fetchFormacao,
  fetchAtuacao,
  fetchSobre,
} from '../services/contentService';

function mapProject(p) {
  return {
    ...p,
    image: p.imageUrl || p.image,
  };
}

export function useProjects(type) {
  const [items, setItems] = useState(
    DEFAULT_PROJECTS.filter((p) => p.type === type).map(mapProject)
  );
  const [loading, setLoading] = useState(true);
  const [fromFirebase, setFromFirebase] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await fetchProjects();
      if (cancelled) return;
      if (remote?.length) {
        setItems(remote.filter((p) => p.type === type).map(mapProject));
        setFromFirebase(true);
      } else {
        setItems(DEFAULT_PROJECTS.filter((p) => p.type === type).map(mapProject));
        setFromFirebase(false);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [type]);

  return { items, loading, fromFirebase };
}

export function useFormacao() {
  const [items, setItems] = useState(DEFAULT_FORMACAO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await fetchFormacao();
      if (cancelled) return;
      if (remote?.length) setItems(remote);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading };
}

export function useAtuacao() {
  const [items, setItems] = useState(DEFAULT_ATUACAO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await fetchAtuacao();
      if (cancelled) return;
      if (remote?.length) setItems(remote);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading };
}

export function useSobre() {
  const [data, setData] = useState(DEFAULT_SOBRE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await fetchSobre();
      if (cancelled) return;
      if (remote) {
        setData({
          ...DEFAULT_SOBRE,
          ...remote,
          paragraphs: remote.paragraphs?.length
            ? remote.paragraphs
            : DEFAULT_SOBRE.paragraphs,
          highlights: remote.highlights?.length
            ? remote.highlights
            : DEFAULT_SOBRE.highlights,
        });
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}

/** Converte **negrito** simples em <strong> para o HTML do sobre */
export function renderBoldMarkdown(text) {
  if (!text) return '';
  return String(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
