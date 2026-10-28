# Configurar Firebase (do zero)

Enquanto o código do painel já está no repositório, complete estes passos no [Firebase Console](https://console.firebase.google.com/).

## 1. Criar o projeto

1. **Add project** → nome (ex.: `portfifolio`).
2. Pode desligar Google Analytics se quiser.

## 2. App Web

1. Em Project Overview → **Add app** → Web (`</>`).
2. Copie o objeto `firebaseConfig`.
3. No projeto local:

```bash
cp .env.example .env.local
```

4. Preencha:

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

5. Reinicie `npm start`.

## 3. Authentication (só você)

1. Build → **Authentication** → Get started.
2. Sign-in method → **Email/Password** → Enable.
3. Users → **Add user** → seu e-mail e uma senha forte.

Esse será o login de `http://localhost:3000/admin/login`.

## 4. Firestore

1. Build → **Firestore Database** → Create database.
2. Escolha **production mode**.
3. Rules → cole o conteúdo de `firebase/firestore.rules` → Publish.

Coleções usadas pelo painel (criadas automaticamente ao salvar):

| Coleção       | Uso                          |
|---------------|------------------------------|
| `projects`    | Projetos emp. / pessoal      |
| `formacao`    | Timeline de formação         |
| `atuacao`     | Áreas de atuação             |
| `siteContent` | Doc `sobre` (textos da home) |

## 5. Storage

1. Build → **Storage** → Get started.
2. Rules → cole o conteúdo de `firebase/storage.rules` → Publish.

Imagens de projetos vão para `projects/...`.

## 6. Usar o painel

1. Abra `/admin/login` e entre com o usuário criado.
2. No Dashboard, clique em **Importar conteúdo atual** (opcional) — sobe formação, atuação, sobre e projetos com fotos já em WebP compactado.
3. Ou cadastre manualmente em Projetos / Formação / Atuação / Sobre.
4. Enquanto o Firestore estiver vazio, o site público usa o fallback do código.
5. Toda foto nova passa por compressão no navegador (~350KB, máx. 1400px, WebP) antes do Storage.

## Produção (Render / Vercel / etc.)

Configure as mesmas variáveis `REACT_APP_FIREBASE_*` no painel de deploy.
