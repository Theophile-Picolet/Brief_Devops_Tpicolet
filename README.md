# News DevOps Tpicolet

## Présentation du projet

Ce projet assemble deux microservices — **Reader** (consultation d'articles et commentaires) et **Writer** (rédaction et gestion d'articles) — chacun composé d'un frontend Next.js et d'un backend Node.js/Express, orchestrés avec Docker Compose et une base PostgreSQL partagée.

### Choix techniques

| Couche | Outil(s) | Justification |
|--------|----------|---------------|
| Conteneurisation | Docker, Docker Compose | Isolation des services, reproductibilité |
| Tests backend | Jest, Supertest, ts-jest | Unitaires + intégration API |
| Tests frontend | Jest, Testing Library, Playwright | Composants + E2E |
| Hooks Git | Husky, lint-staged | Qualité vérifiée avant commit/push |
| Lint / Format | Biome | ESLint + Prettier unifiés, rapide |
| CI | GitHub Actions | Pipeline lint + tests à chaque push |
| Déploiement | Render.io | Hébergement gratuit, Blueprint automatisé |
| Base de données | PostgreSQL | Imposé par le cahier des charges |

---

## Structure du projet

```
.
├── wn-jjklrt-read-dev/           # Microservice Reader
│   ├── back/                     # Backend (Node.js/Express)
│   └── front/                    # Frontend (Next.js)
├── wn-jjklrt-write-dev/          # Microservice Writer
│   ├── write-back/               # Backend (Node.js/Express)
│   └── write-front/              # Frontend (Next.js)
├── docker-compose.yml            # Orchestration des services
├── .env / .env.example           # Variables d'environnement
├── .github/workflows/ci.yml      # Pipeline CI GitHub Actions
├── .husky/                       # Hooks Git (pre-commit, pre-push)
├── render.yaml                   # Configuration déploiement Render
└── DEPLOY_RENDER.md              # Guide de déploiement complet
```

---

## Prérequis

- Node.js >= 20
- Docker & Docker Compose
- Git

---

## Cloner le projet

```bash
git clone https://github.com/Theophile-Picolet/Brief_Devops_Tpicolet.git
cd News_Devops_Tpicolet
```

---

## Variables d'environnement

Copiez les fichiers `.env.example` et remplissez-les avec vos propres valeurs :

```bash
cp .env.example .env
cp wn-jjklrt-read-dev/back/.env.example wn-jjklrt-read-dev/back/.env
cp wn-jjklrt-write-dev/write-back/.env.example wn-jjklrt-write-dev/write-back/.env
```

- Ne partagez jamais vos fichiers `.env` : ils contiennent des informations sensibles (voir `.gitignore`).
- Utilisez `.env.example` pour partager la structure attendue des variables.
- Chaque backend inclut un `.env.test` pointant vers la base de test (port 5433).

---

## Conteneurisation & Dockerfiles

Chaque service dispose de son propre `Dockerfile` pour produire une image autonome :

| Dockerfile | Service |
|-----------|---------|
| `wn-jjklrt-write-dev/write-back/Dockerfile` | Writer — Backend |
| `wn-jjklrt-write-dev/write-front/Dockerfile` | Writer — Frontend |
| `wn-jjklrt-read-dev/back/Dockerfile` | Reader — Backend |
| `wn-jjklrt-read-dev/front/Dockerfile` | Reader — Frontend |

Le `docker-compose.yml` à la racine assemble l'ensemble : frontends, backends, base PostgreSQL principale et base de test (port 5433).

---

## Lancement de l'application

```bash
# Démarrer tous les services
docker compose up --build

# Démarrer en arrière-plan
docker compose up -d

# Arrêter les services
docker compose down

# Nettoyer complètement (volumes inclus)
docker compose down --volumes --remove-orphans
```

---

## Tests automatisés

### Base de données de test (isolation)

Tous les tests backend utilisent une base PostgreSQL dédiée (port 5433), isolée de la production :

- Le service `database-test` est défini dans `docker-compose.yml` avec le même schéma que la base principale.
- Chaque backend charge `.env.test` **avant** tout import applicatif pour pointer vers cette base.
- La base de test est initialisée automatiquement au démarrage des services Docker.

> **Important** : démarrez Docker avant de lancer les tests — `docker compose up -d`.
> Ne jamais exécuter les tests sur la base de production.

### Lancer la suite complète (depuis la racine)

```bash
npm run test:unit    # tests unitaires + intégration (writer + reader)
npm run test:e2e     # tests E2E Playwright (writer frontend)
npm test             # suite complète (exécuté automatiquement par le hook pre-push)
```

---

### Writer — Backend

```bash
cd wn-jjklrt-write-dev/write-back && npm install && npm test
```

**Couverture :** tests unitaires (mocks, ex : `article-service.test.ts`) + tests d'intégration API (ex : `article-api.test.ts`).

**Configuration :**
- 5 articles de test insérés via `schema.sql`
- Connexion à la base fermée après les tests (`afterAll`)
- Serveur Express ne démarre pas en mode test (`NODE_ENV=test`)

---

### Writer — Frontend

```bash
cd wn-jjklrt-write-dev/write-front && npm install
```

**Tests unitaires (Jest + Testing Library) :**
```bash
npm test
```

**Tests E2E (Playwright) :**
```bash
npx playwright test --headed
# ou interface graphique
npx playwright test --ui
```

**Dépendances :** `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@playwright/test`

**Bonnes pratiques E2E :**
- Titre unique généré à chaque exécution pour éviter les doublons en base.
- Le titre (clé primaire) ne doit pas être modifié lors de l'édition.

---

### Reader — Backend

```bash
cd wn-jjklrt-read-dev/back && npm install && npm test
```

**Tests d'intégration API — 10 tests (`code/routes/article-api.test.ts`) :**

| Scénario | Statut attendu |
|----------|---------------|
| GET `/api/articles` | 200 |
| GET `/api/articles/:title` | 200 |
| GET `/api/articles/category/:category` | 200 |
| GET `/api/articles/:title/comments` | 200 |
| POST `/api/articles/:title/comments` | 201 |
| GET article inexistant | 404 |
| GET catégorie vide | 404 |
| POST commentaire sans description | 400 |
| POST commentaire > 1000 caractères | 400 |
| POST commentaire, article inexistant | 404 |

Article de test utilisé : `decouverte-d-une-exoplanete`.

---

### Reader — Frontend

```bash
cd wn-jjklrt-read-dev/front && npm install
```

**Tests unitaires (19 tests) — fichiers dans `app/component/ui/__tests__/` :**

- **BackButton.test.tsx** (6) : label par défaut/personnalisé, href, classes CSS, icône SVG.
- **Comments.test.tsx** (6) : chargement, affichage, liste vide, erreur, encodage URL.
- **AddCommentButton.test.tsx** (7) : ouverture/fermeture modale, validation, fetch POST, loader, succès.

```bash
npm test             # unitaires
npm run test:watch   # mode watch
npm run test:e2e     # E2E Playwright
```

**Tests E2E (12 tests) — fichiers dans `tests/` :**
- `article-navigation.spec.ts` (3) : liste, détail, commentaire, erreur 404.
- `category-filter.spec.ts` (4) : filtrage par catégorie, navigation depuis les résultats.
- `global-navigation.spec.ts` (5) : header, liens, pages accueil/à-propos, bouton retour.

**Configuration Playwright :** baseURL `http://localhost:3000`, timeout 30s, chromium uniquement.

---

## Hooks Git (Husky)

| Hook | Commande exécutée | Effet en cas d'échec |
|------|------------------|---------------------|
| `pre-commit` | `npx lint-staged` (Biome sur les fichiers stagés) | Commit annulé |
| `pre-push` | `npm test` (suite complète) | Push annulé |

Activer les hooks après un clone :
```bash
npm ci
npx husky install
```

**Commandes de lint/format manuelles (racine) :**

| Commande | Description |
|----------|-------------|
| `npm run lint` | Lint tous les services (Biome) |
| `npm run format` | Formate tout le code (Biome) |
| `npm run lint:writer-back` | Lint uniquement le backend Writer |
| `npm run lint:writer-front` | Lint uniquement le frontend Writer |
| `npm run lint:reader-back` | Lint uniquement le backend Reader |
| `npm run lint:reader-front` | Lint uniquement le frontend Reader |

> ⚠️ `lint-staged` ne vérifie que les fichiers modifiés/stagés. Pour vérifier tout le projet : `npm run lint`.
> Pour bypasser temporairement (urgence uniquement) : `git commit --no-verify`

---

## Intégration Continue (GitHub Actions)

Workflow défini dans `.github/workflows/ci.yml`, déclenché à chaque push et PR sur `main`.

**Pipeline :**
```
Push/PR → Lint → [Writer Back | Writer Front | Reader Back | Reader Front] → Build Success
```

| Job | Contenu | Prérequis |
|-----|---------|-----------|
| Lint | Biome sur tous les services | — |
| Writer Backend | 9 tests Jest/Supertest | PostgreSQL port 5433 |
| Writer Frontend | 3 tests Jest/Testing Library | — |
| Reader Backend | 10 tests Jest/Supertest + migrations | PostgreSQL port 5432 |
| Reader Frontend | 19 tests Jest/Testing Library | — |

Les fichiers `.env.test` sont créés dynamiquement par le workflow. Le pipeline bloque le merge en cas d'échec.

Les résultats sont visibles dans l'onglet **Actions** du dépôt GitHub.

![CI/CD Status](https://github.com/Theophile-Picolet/Brief_Devops_Tpicolet/actions/workflows/ci.yml/badge.svg)

---

## Déploiement

### Sur Render.io (Blueprint automatisé)

Le projet est configuré via `render.yaml` pour un déploiement Blueprint automatique.

**Étapes :**
1. Dashboard Render → **New > Blueprint** → connecter le dépôt GitHub.
2. Render détecte `render.yaml` et crée les 5 services automatiquement.
3. Initialiser la base de données depuis votre terminal local :
   ```bash
   export DATABASE_URL="postgres://...@dpg-xxx.oregon-postgres.render.com/db_writer"
   ./init-db-render.sh
   ```
4. Mettre à jour `NEXT_PUBLIC_API_URL` (frontends) et `CLIENT_URL` (backends) avec les URLs des services déployés.

**Services créés :**

| Service | Type |
|---------|------|
| `news-devops-db` | PostgreSQL (gratuit, expire 90 jours) |
| `writer-backend` | API Node.js |
| `reader-backend` | API Node.js |
| `writer-frontend` | Next.js |
| `reader-frontend` | Next.js |

**URLs de production attendues :**
```
https://writer-frontend-xxx.onrender.com
https://reader-frontend-xxx.onrender.com
https://writer-backend-xxx.onrender.com/api/articles
https://reader-backend-xxx.onrender.com/api/articles
```

> ⚠️ Plan gratuit : les services passent en veille après 15 min d'inactivité (premier appel : 30-60s).

📖 Voir `DEPLOY_RENDER.md` pour le guide détaillé et le dépannage.

---

## Récapitulatif des commandes

### Docker
```bash
docker compose up --build       # démarrer tous les services (avec rebuild)
docker compose up -d             # démarrer en arrière-plan
docker compose down              # arrêter les services
docker compose down -v           # arrêter + supprimer les volumes
```

### Tests (depuis la racine)
```bash
npm run test:unit                # unitaires + intégration (writer + reader)
npm run test:e2e                 # E2E writer (Playwright)
npm test                         # suite complète

# Par service
cd wn-jjklrt-write-dev/write-back && npm test
cd wn-jjklrt-write-dev/write-front && npm test
cd wn-jjklrt-read-dev/back && npm test
cd wn-jjklrt-read-dev/front && npm test

# E2E avec interface
npx playwright test --ui
npx playwright test --headed
```

### Lint / Format
```bash
npm run lint                     # tous les services
npm run format                   # formate tout le code
```

---

## ⚠️ Résolutions de problèmes fréquents

### `ECONNREFUSED 127.0.0.1:5433` lors des tests
Docker n'est pas démarré. Lancez `docker compose up -d` puis relancez les tests.

### Jest exécute les fichiers Playwright (`.spec.ts`)
Vérifier dans `wn-jjklrt-write-dev/write-front/jest.config.js` :
```javascript
testPathIgnorePatterns: ["/node_modules/", "/tests/"]
```
- `npm test` → tests Jest uniquement (`.test.tsx` dans `src/`)
- `npx playwright test` → tests Playwright uniquement (`.spec.ts` dans `tests/`)

### `Found multiple elements` dans les tests Jest
La page `/edit` contient deux formulaires avec le même message de succès :
```tsx
// ✅
const messages = screen.getAllByText(/Article mis à jour/i);
expect(messages[messages.length - 1]).toBeInTheDocument();
```
```typescript
// ✅ Playwright
await expect(page.locator("text=/Article mis à jour/").last()).toBeVisible();
```

### Duplication `/api/api/` dans les routes
Si le router est monté avec `app.use("/api", router)`, les routes individuelles ne doivent **pas** inclure le préfixe `/api` :
```typescript
router.get("/articles", Article.browse); // ✅ → donne /api/articles
```

### Erreur TypeScript `QueryResult<unknown>`
```typescript
// ✅ Utiliser QueryResultRow
import type { QueryResult, QueryResultRow } from "pg";
type Result = QueryResult<QueryResultRow>;
```

### `SASL: client password must be a string`
Le fichier `.env.test` est absent ou incomplet. Vérifiez qu'il est chargé **avant** tout import applicatif dans les fichiers de test.

### Tests échouent en local mais passent sur GitHub Actions
Vérifiez que la base de test est démarrée : `docker compose up -d database-test`. Assurez-vous que le schéma et les migrations sont à jour.
