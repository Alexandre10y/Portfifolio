import {
  DEFAULT_ATUACAO,
  DEFAULT_FORMACAO,
  DEFAULT_PROJECTS,
  DEFAULT_SOBRE,
} from '../data/defaults';
import {
  createItem,
  listCollection,
  saveSiteContent,
  getSiteContent,
  uploadProjectImage,
} from './contentService';

async function urlToFile(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao ler imagem local: ${filename}`);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
}

/**
 * Importa o conteúdo padrão do código para o Firestore/Storage.
 * Não sobrescreve coleções que já tenham documentos.
 */
export async function seedPortfolioContent({ onProgress } = {}) {
  const report = {
    formacao: 0,
    atuacao: 0,
    sobre: false,
    projects: 0,
    skipped: [],
  };

  const existingFormacao = await listCollection('formacao');
  if (existingFormacao.length) {
    report.skipped.push('formacao');
  } else {
    for (const item of DEFAULT_FORMACAO) {
      const { id, ...data } = item;
      await createItem('formacao', data);
      report.formacao += 1;
    }
  }

  const existingAtuacao = await listCollection('atuacao');
  if (existingAtuacao.length) {
    report.skipped.push('atuacao');
  } else {
    for (const item of DEFAULT_ATUACAO) {
      const { id, ...data } = item;
      await createItem('atuacao', data);
      report.atuacao += 1;
    }
  }

  const existingSobre = await getSiteContent('sobre');
  if (existingSobre) {
    report.skipped.push('sobre');
  } else {
    await saveSiteContent('sobre', DEFAULT_SOBRE);
    report.sobre = true;
  }

  const existingProjects = await listCollection('projects');
  if (existingProjects.length) {
    report.skipped.push('projects');
  } else {
    const total = DEFAULT_PROJECTS.length;
    for (let i = 0; i < total; i += 1) {
      const project = DEFAULT_PROJECTS[i];
      onProgress?.({
        step: 'projects',
        current: i + 1,
        total,
        title: project.title,
      });

      const filename = `${project.id}.jpg`;
      const file = await urlToFile(project.image, filename);
      const uploaded = await uploadProjectImage(file, project.id);

      const { id, image, ...rest } = project;
      await createItem('projects', {
        ...rest,
        imageUrl: uploaded.url,
        imagePath: uploaded.path,
      });
      report.projects += 1;
    }
  }

  return report;
}
