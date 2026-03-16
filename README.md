# News DevOps Tpicolet

## Présentation du projet

Ce projet est une application composée de deux microservices (reader et writer), chacun avec un frontend (Next.js/React) et un backend (Node.js). L'orchestration se fait via Docker Compose, avec une base de données PostgreSQL partagée.

## Cloner le projet

Pour récupérer le code source :

- Ouvrez un terminal
- Tapez la commande suivante :

```bash
git clone https://github.com/Theophile-Picolet/Brief_Devops_Tpicolet.git
cd News_Devops_Tpicolet
```

## Variables d'environnement

- Copiez le fichier `.env.example` et renommez-le en `.env` à la racine du projet.
- Faites de même pour les fichiers `.env.example` présents dans :
  - `wn-jjklrt-read-dev/back/`
  - `wn-jjklrt-write-dev/write-back/`
- Remplissez chaque variable avec vos propres valeurs (mot de passe, nom de base, etc.).
- Ne partagez jamais vos fichiers `.env` : ils contiennent des informations sensibles.

Exemple de commandes :

```bash
cp .env.example .env
cp wn-jjklrt-read-dev/back/.env.example wn-jjklrt-read-dev/back/.env
cp wn-jjklrt-write-dev/write-back/.env.example wn-jjklrt-write-dev/write-back/.env
```

## Lancement de l'application

Pour démarrer tous les services en local :

```bash
docker-compose up --build
```

Pour arrêter tous les services :

```bash
docker-compose down
```

## Structure du projet

- `wn-jjklrt-read-dev/` : microservice reader (front + back)
- `wn-jjklrt-write-dev/` : microservice writer (front + back)
- `docker-compose.yml` : orchestration des services
- `.env` / `.env.example` : variables d'environnement globales


## Gestion de la base de test et isolation des tests backend

### Utilisation d'une base PostgreSQL dédiée aux tests

Pour garantir l'intégrité des données de production, tous les tests backend s'exécutent sur une base de données PostgreSQL dédiée aux tests, totalement isolée de la base principale.

- Un service `database-test` est défini dans le `docker-compose.yml` (port 5433), avec le même schéma et les mêmes scripts d'initialisation que la base principale.
- Les variables d'environnement pour la base de test sont définies dans un fichier `.env.test` (exemple fourni dans `wn-jjklrt-write-dev/write-back/.env.test`).
- Lors de l'exécution des tests, le backend charge ce fichier `.env.test` pour pointer vers la base de test (DB_PORT=5433, DB_HOST=localhost ou database-test selon le contexte).
- Les scripts de test (Jest/Supertest) chargent explicitement `.env.test` avant toute importation du code applicatif pour garantir que le pool de connexion utilise la bonne base.
- La base de test est automatiquement initialisée à chaque démarrage du service Docker.

### Bonnes pratiques

- Ne jamais exécuter les tests sur la base de production.
- Toujours vérifier que les tests manipulent la base de test (logs, port 5433, etc.).
- Nettoyer la base de test si besoin avant/après les tests pour garantir l'indépendance des campagnes de tests.

---
## Sécurité

- Le fichier `.env` ne doit jamais être versionné (voir `.gitignore`).
- Utilisez toujours `.env.example` pour partager la structure attendue des variables.

## Tests automatisés Writer

### Backend Writer

Le backend writer (`wn-jjklrt-write-dev/write-back`) dispose de tests automatisés unitaires et d'intégration pour garantir la qualité du code.

#### Installation des dépendances de test

Les dépendances de test (Jest, Supertest, ts-jest) sont déjà incluses dans le `package.json`. Pour les installer :

```bash
cd wn-jjklrt-write-dev/write-back
npm install
```

#### Lancer les tests

Pour exécuter tous les tests (unitaires et d'intégration) :

```bash
npm test
```

Cette commande lance Jest avec l'environnement de test configuré (`NODE_ENV=test`).

#### Types de tests

- **Tests unitaires** : testent les fonctions/méthodes de manière isolée avec des mocks (ex : `article-service.test.ts`)
- **Tests d'intégration API** : testent les endpoints de l'API avec une vraie connexion à la base de données (ex : `article-api.test.ts`)

#### Configuration des tests

- Les tests utilisent la base de données PostgreSQL configurée dans `.env`
- Les données de test sont initialisées via `schema.sql` (5 articles de test insérés automatiquement)
- La connexion à la base est fermée proprement après les tests pour éviter les fuites de ressources
- Le serveur Express ne démarre pas pendant les tests (`NODE_ENV=test`)

#### Données de test

Le fichier `wn-jjklrt-write-dev/database/schema.sql` contient un jeu de 5 articles de test qui sont insérés automatiquement lors de l'initialisation de la base de données. Ces données permettent de tester les opérations CRUD sur l'API.

#### Bonnes pratiques

- Lancez les tests avant chaque commit pour valider vos modifications
- Les tests sont obligatoires pour la validation du projet
- Ajoutez des tests pour chaque nouvelle fonctionnalité

---


### Tests automatisés Frontend Writer

### Frontend (Next.js/React)

#### Dépendances installées

- Tests unitaires :
  - jest
  - @testing-library/react
  - @testing-library/jest-dom
  - @testing-library/user-event
  - typescript (pour le typage)
  - @types/jest
  - @types/testing-library__react
  - @types/testing-library__user-event

- Tests E2E :
  - @playwright/test

#### Installation des dépendances de test

```bash
cd wn-jjklrt-write-dev/write-front
npm install
```

#### Lancer les tests unitaires (Jest)

```bash
npm test
# ou
npx jest
```

#### Lancer les tests E2E (Playwright)

```bash
npx playwright test --headed
# ou pour l’interface graphique
npx playwright test --ui
```

Les tests E2E sont situés dans le dossier `tests/` et utilisent Playwright pour simuler des parcours utilisateur réels (création et édition d’article).

#### Bonnes pratiques E2E
- Un titre unique est généré à chaque exécution de test pour éviter les conflits de clé primaire.
- Les tests E2E ne modifient pas la clé primaire (titre) lors de l’édition pour éviter les erreurs de duplication.
- Nettoyez la base de données si besoin avant/après les tests pour éviter les doublons.

---
## ⚠️ Nuances importantes et résolutions de problèmes

### Séparation des tests : Jest vs Playwright

**Problème identifié** : Par défaut, Jest essayait d'exécuter les tests Playwright (fichiers `.spec.ts` dans `tests/`), ce qui causait des erreurs de compatibilité.

**Solution** : Configuration Jest pour ignorer les tests E2E.

Dans `wn-jjklrt-write-dev/write-front/jest.config.js` :
```javascript
testPathIgnorePatterns: ["/node_modules/", "/tests/"]
```

**Résultat** :
- `npm test` → Lance **uniquement** les tests unitaires Jest (fichiers `.test.tsx` dans `src/`)
- `npx playwright test` → Lance **uniquement** les tests E2E Playwright (fichiers `.spec.ts` dans `tests/`)

### Tests E2E : Docker doit être lancé

**Important** : Les tests Playwright nécessitent que l'application soit en cours d'exécution via Docker.

Workflow correct :
```bash
# 1. Démarrer Docker
docker compose up -d

# 2. Attendre que les services soient prêts (quelques secondes)

# 3. Lancer les tests E2E
npx playwright test
```

Si Docker n'est pas lancé, les tests échoueront avec des erreurs du type `element(s) not found`.

---

## Tests automatisés Reader

### Backend Reader

Le backend Reader (`wn-jjklrt-read-dev/back`) dispose de tests d'intégration API couvrant tous les endpoints.

#### Installation des dépendances de test

Les dépendances de test (Jest, Supertest, ts-jest) sont incluses dans le `package.json` :

```bash
cd wn-jjklrt-read-dev/back
npm install
```

#### Lancer les tests

Pour exécuter tous les tests d'intégration :

```bash
npm test
```

Cette commande lance Jest avec l'environnement de test configuré (`NODE_ENV=test`).

#### Tests d'intégration API (10 tests)

Le fichier `code/routes/article-api.test.ts` contient 10 tests couvrant :

**Scénarios de succès (5 tests)** :
- GET `/api/articles` - Récupération de tous les articles (200)
- GET `/api/articles/:title` - Récupération d'un article par titre (200)
- GET `/api/articles/category/:category` - Filtrage par catégorie (200)
- GET `/api/articles/:title/comments` - Récupération des commentaires (200)
- POST `/api/articles/:title/comments` - Création d'un commentaire (201)

**Scénarios d'erreur (5 tests)** :
- GET article inexistant - Retour 404 avec message "aucun article correspond"
- GET catégorie vide - Retour 404 avec message d'erreur approprié
- POST commentaire sans description - Retour 400 "Description obligatoire"
- POST commentaire trop long (>1000 caractères) - Retour 400
- POST commentaire sur article inexistant - Retour 404 "Article non trouvé"

#### Configuration des tests

- Base de données : PostgreSQL configurée dans `.env`
- Article de test utilisé : `decouverte-d-une-exoplanete` (présent dans `writer.articles`)
- Nettoyage : Connexion pool fermée proprement après tests (`afterAll`)
- Serveur : Express n'écoute pas sur un port pendant les tests (`NODE_ENV=test`)

#### Bugs corrigés pendant les tests

1. **Catégorie vide retournait 200** : Ajout d'une vérification `Array.isArray() && length === 0` dans `article-controller.ts`
2. **Commentaire incomplet** : Le service ne retournait que `{id, created_at}`. Ajout de tous les champs dans la clause `RETURNING`

---

### Frontend Reader

Le frontend Reader (`wn-jjklrt-read-dev/front`) dispose de tests unitaires de composants et de tests E2E.

#### Installation des dépendances de test

```bash
cd wn-jjklrt-read-dev/front
npm install
```

#### Tests unitaires de composants (19 tests)

Fichiers de tests dans `app/component/ui/__tests__/` :

**BackButton.test.tsx (6 tests)** :
- Affichage du label par défaut "Retour aux articles"
- Gestion du label personnalisé
- Vérification du href par défaut `/articles`
- Support des href personnalisés
- Application des classes CSS personnalisées
- Présence de l'icône SVG de flèche

**Comments.test.tsx (6 tests)** :
- Affichage du message de chargement initial
- Affichage des commentaires après chargement réussi
- Message "Aucun commentaire" quand la liste est vide
- Gestion des erreurs de chargement
- Encodage correct du titre d'article dans l'URL
- Encodage des espaces avec `encodeURIComponent`

**AddCommentButton.test.tsx (7 tests)** :
- Affichage du bouton d'ajout de commentaire
- Ouverture de la modale au clic
- Fermeture de la modale (bouton ×)
- Contraintes de validation (required, maxLength="1000")
- Appel fetch avec les bonnes données (POST JSON)
- Affichage du loader "Envoi en cours..."
- Fermeture de la modale après succès

#### Lancer les tests unitaires

```bash
npm test
# ou mode watch
npm run test:watch
```

#### Tests E2E (12 tests)

Fichiers de tests dans `tests/` :

**article-navigation.spec.ts (3 tests)** :
- Navigation vers la liste des articles et consultation d'un détail
- Affichage d'un message d'erreur pour article inexistant (404)
- Ajout d'un commentaire sur un article

**category-filter.spec.ts (4 tests)** :
- Affichage de la page de filtrage par catégorie
- Filtrage par "Sciences et technologies"
- Filtrage par "International"
- Navigation vers un article depuis les résultats filtrés

**global-navigation.spec.ts (5 tests)** :
- Affichage du header sur toutes les pages
- Navigation entre les pages via les liens
- Affichage correct de la page d'accueil
- Affichage correct de la page "À propos"
- Utilisation du bouton retour pour revenir à la liste

#### Lancer les tests E2E

```bash
npm run test:e2e
# ou en mode headed (visible)
npm run test:e2e:headed
```

#### Configuration Playwright

- `playwright.config.ts` : Configuration avec baseURL `http://localhost:3000` (reader-front)
- Timeout : 30000ms par test
- Reporter : list
- Browsers : chromium uniquement

#### Bonnes pratiques Reader

- **Docker requis** : Les tests E2E nécessitent que tous les services Docker soient lancés
- **Délais d'attente** : Ajout de `waitForTimeout` pour laisser le temps aux composants client (`ssr: false`) de charger
- **Sélecteurs robustes** : Utilisation de `getByRole`, `getByText`, et `locator` avec regex pour gérer la casse
- **BackButton** : C'est un `<Link>` (role="link"), pas un `<button>` (role="button")

---

### Gestion des éléments multiples dans les tests

**Problème** : Sur la page `/edit`, il y a **2 formulaires** qui affichent le même message de succès "Article mis à jour", ce qui causait une erreur `Found multiple elements`.

**Solution** : Utiliser `getAllByText` et sélectionner le dernier élément.

Dans les tests unitaires Jest :
```tsx
// ❌ Avant
expect(screen.getByText(/Article mis à jour/i)).toBeInTheDocument();

// ✅ Après
const messages = screen.getAllByText(/Article mis à jour/i);
expect(messages[messages.length - 1]).toBeInTheDocument();
```

Dans les tests E2E Playwright :
```typescript
// ❌ Avant
await expect(page.locator("text=/Article mis à jour/")).toBeVisible();

// ✅ Après
await expect(page.locator("text=/Article mis à jour/").last()).toBeVisible();
```

### Routes API : Éviter la duplication /api/api/

**Problème identifié** : Les routes étaient définies avec `/api/articles` dans `router.ts`, mais le router était monté avec `app.use("/api", router)` dans `index.ts`, créant des URLs en `/api/api/articles` au lieu de `/api/articles`.

**Solution** : Retirer le préfixe `/api` des routes individuelles.

Dans `wn-jjklrt-write-dev/write-back/src/routes/router.ts` :
```typescript
// ✅ Correct
router.post("/articles", validateArticle, Article.add);
router.get("/articles", Article.browse);
router.get("/articles/:title", Article.readByTitle);
// etc.
```

Et dans `index.ts` :
```typescript
app.use("/api", router); // Le préfixe /api est ajouté ici
```

### Typage TypeScript strict avec PostgreSQL

**Problème** : L'utilisation de `QueryResult<unknown>` causait des erreurs de compilation TypeScript lors du build Docker :
```
error TS2344: Type 'unknown' does not satisfy the constraint 'QueryResultRow'
```

**Solution** : Utiliser `QueryResultRow` au lieu de `unknown`.

Dans les fichiers de configuration DB (`db.ts`, `client.ts`) :
```typescript
import type { Pool as PgPool, QueryResult, QueryResultRow } from "pg";

type Result = QueryResult<QueryResultRow>;
type Rows = QueryResultRow[];
```

Cette modification garantit la compatibilité avec les contraintes de types de PostgreSQL tout en maintenant la sécurité des types.

### Lint-staged : Fichiers stagés uniquement

**Important** : Le hook `pre-commit` via `lint-staged` ne vérifie **que les fichiers modifiés/stagés**, pas l'ensemble du code.

**Conséquence** : Il est possible de faire un commit réussi même si d'autres fichiers non modifiés contiennent des erreurs de lint.

**Pour vérifier tout le code** :
```bash
npm run lint  # Vérifie TOUS les fichiers de tous les services
```

**Distinction importante** :
- `git commit` → Vérifie uniquement les fichiers modifiés
- `npm run lint` → Vérifie tous les fichiers du projet
- `git push` → Lance tous les tests unitaires (pas de lint complet)

---
## Récapitulatif des commandes utiles

### Docker
- Démarrer tous les services :
  ```bash
  docker-compose up --build
  ```
- Arrêter tous les services :
  ```bash
  docker-compose down
  ```
- Voir les ports ouverts :
  ```bash
  sudo lsof -i -P -n | grep LISTEN
  ```
- Arrêter tous les conteneurs Docker :
  ```bash
  docker stop $(docker ps -q)
  ```

### Backend
- Lancer les tests backend Writer :
  ```bash
  cd wn-jjklrt-write-dev/write-back
  npm test
  ```
- Lancer les tests backend Reader :
  ```bash
  cd wn-jjklrt-read-dev/back
  npm test
  ```

### Frontend
- Lancer les tests unitaires Writer :
  ```bash
  cd wn-jjklrt-write-dev/write-front
  npm test
  ```
- Lancer les tests E2E Writer :
  ```bash
  npx playwright test --headed
  ```
- Lancer les tests unitaires Reader :
  ```bash
  cd wn-jjklrt-read-dev/front
  npm test
  ```
- Lancer les tests E2E Reader :
  ```bash
  cd wn-jjklrt-read-dev/front
  npm run test:e2e
  ```

---

## À faire / Amélioration continue

- [ ] Ajouter un nettoyage automatique de la base avant/après les tests E2E si besoin
- [ ] Compléter la documentation sur le déploiement en production
- [x] ~~Vérifier la logique de recherche et d'édition d'article côté backend writer~~ → Résolu (correction des routes /api)
- [x] ~~Résoudre les conflits entre tests Jest et Playwright~~ → Résolu (testPathIgnorePatterns)
- [x] ~~Corriger le typage TypeScript pour QueryResult~~ → Résolu (QueryResultRow)

N'hésitez pas à compléter ce README au fur et à mesure de l'avancement du projet.

## GitHub Actions CI/CD Pipeline

![CI/CD Status](https://github.com/Theophile-Picolet/Brief_Devops_Tpicolet/actions/workflows/ci.yml/badge.svg)

### Configuration de l'intégration continue

Le projet dispose d'un pipeline GitHub Actions qui s'exécute automatiquement sur chaque push et pull request vers la branche `main`.

**📊 Statistiques du pipeline :**
- ⚡ Temps d'exécution moyen : 3-5 minutes
- 🧪 Nombre total de tests : 53 (9 writer-back + 3 writer-front + 10 reader-back + 31 reader-front)
- 🔍 Outils utilisés : Node.js 20, PostgreSQL 16, Biome, Jest, Playwright

#### Workflow CI/CD

Le pipeline [.github/workflows/ci.yml](.github/workflows/ci.yml) effectue les vérifications suivantes :

**1. Lint & Format Check** 🔍
- Vérifie le formatage et le linting de tous les services avec Biome
- Bloque si des erreurs de qualité de code sont détectées

**2. Tests Backend Writer** 🧪
- Lance PostgreSQL dans un conteneur de service
- Initialise le schéma de base de données
- Exécute les 9 tests unitaires et d'intégration
- Vérifie que l'API fonctionne correctement

**3. Tests Frontend Writer** 🎨
- Exécute les 3 tests de composants React
- Vérifie le rendu et le comportement des composants

**4. Tests Backend Reader** 🧪
- Lance PostgreSQL dans un conteneur de service
- Initialise le schéma Writer + migrations Reader (vues)
- Exécute les 10 tests d'intégration API
- Vérifie la lecture des articles et la gestion des commentaires

**5. Tests Frontend Reader** 🎨
- Exécute les 19 tests de composants React
- Vérifie BackButton, Comments, AddCommentButton

**6. Build Success** ✅
- Notification de succès si tous les tests passent

#### Déclenchement du pipeline

Le pipeline se déclenche automatiquement sur :
- `git push` vers la branche `main`
- Ouverture ou mise à jour d'une Pull Request vers `main`

#### Visualiser les résultats

Les résultats du pipeline sont visibles dans l'onglet **Actions** de votre dépôt GitHub :
```
https://github.com/votre-username/Brief_Devops_Tpicolet/actions
```

Un ✅ vert = tous les tests passent
Un ❌ rouge = au moins un test a échoué

#### Services PostgreSQL dans GitHub Actions

Le workflow utilise des **services Docker** pour les tests nécessitant une base de données :
- Writer Backend : PostgreSQL sur port 5433
- Reader Backend : PostgreSQL sur port 5432

Les bases sont automatiquement créées et détruites pour chaque exécution du workflow.

#### Variables d'environnement CI

Les fichiers `.env.test` sont créés dynamiquement par le workflow avec les valeurs suivantes :
```env
DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=db_writer
NODE_ENV=test
```

#### Architecture du pipeline

```
Push/PR → main
      │
      ▼
┌──────────────┐
│  1. Lint 🔍  │  ← Vérifie qualité code (30-45s)
└──────┬───────┘
       │
   ┌───┴───┬───────┬───────┐
   │       │       │       │
   ▼       ▼       ▼       ▼
┌──────┐┌──────┐┌──────┐┌──────┐
│Test  ││Test  ││Test  ││Test  │
│Writer││Writer││Reader││Reader│
│Back  ││Front ││Back  ││Front │
│(9✓)  ││(3✓)  ││(10✓) ││(31✓) │
└──┬───┘└──┬───┘└──┬───┘└──┬───┘
   │       │       │       │
   └───┬───┴───────┴───────┘
       │
       ▼
┌─────────────────┐
│ Build Success ✅ │
└─────────────────┘
```

**Les jobs s'exécutent en parallèle** après le lint, ce qui accélère le pipeline.

#### Concepts clés

| Terme | Définition |
|-------|------------|
| **Workflow** | Processus automatisé défini dans `.github/workflows/ci.yml` |
| **Job** | Tâche indépendante exécutée sur une machine virtuelle Ubuntu |
| **Step** | Action individuelle au sein d'un job (checkout, install, test...) |
| **Service** | Conteneur Docker (ex: PostgreSQL) utilisé par un job |
| **Health Check** | Vérification que PostgreSQL est prêt avant d'exécuter les tests |
| **Cache npm** | Réutilisation de `node_modules/` entre les exécutions (gain de temps) |

#### Commandes importantes

| Commande | Usage | Pourquoi |
|----------|-------|----------|
| `npm ci` | Installation des dépendances en CI | Reproductibilité garantie (utilise `package-lock.json`) |
| `npm install` | Installation locale | Peut modifier `package-lock.json` |
| `pg_isready` | Vérifie si PostgreSQL est prêt | Évite les tests avant que la BDD soit opérationnelle |

#### Structure de chargement des variables d'environnement

Les backends (writer et reader) utilisent une structure identique pour charger les variables d'environnement en test :

**Fichiers de test** (`*.test.ts`) :
```typescript
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });  // ← Charge .env.test AVANT tout import
import request from "supertest";
import app from "../index";
```

**Fichiers de configuration** (`db.ts` / `client.ts`) :
```typescript
import dotenv from "dotenv";
dotenv.config();  // ← Charge automatiquement .env ou .env.test selon NODE_ENV
import { Pool } from "pg";
```

**Pourquoi cette structure ?**
- Les tests chargent **explicitement** `.env.test` en premier
- Les autres imports (db.ts, client.ts) trouvent les variables déjà chargées
- Garantit que les tests utilisent toujours la base de test (port 5433 local, 5432/5433 CI)

#### Dépannage (Troubleshooting)

**Erreur : "SASL: client password must be a string"**
- ✅ **Solution** : Vérifiez que le fichier `.env.test` existe et contient toutes les variables requises
- ✅ Le test doit charger `.env.test` en PREMIER (avant les imports du code)

**Erreur : "port already in use"**
- ✅ **Solution** : Arrêtez tous les conteneurs Docker : `docker compose down`
- ✅ Vérifiez qu'aucun PostgreSQL local n'utilise les ports 5432/5433

**Tests échouent en local mais passent sur GitHub Actions**
- ✅ **Solution** : Vérifiez que la base de test est démarrée : `docker compose up -d database-test`
- ✅ Assurez-vous que le schéma et les migrations sont à jour

**Workflow GitHub Actions échoue**
- ✅ Consultez les logs détaillés dans l'onglet "Actions" de votre dépôt
- ✅ Vérifiez que tous les fichiers `.env.test` sont créés correctement dans le workflow
- ✅ Assurez-vous que les health checks PostgreSQL fonctionnent (timeout 50s max)

---

## Qualité de code : Biome & Husky

### Linting et formatage automatisés

Le projet utilise **Biome** pour le linting et le formatage de tous les services (front et back, reader et writer).
Les vérifications sont automatisées grâce à **Husky** et **lint-staged**.

#### Fonctionnement des hooks Git

- **pre-commit** :
  - Formate et vérifie uniquement les fichiers modifiés/stagés avec Biome.
  - Bloque le commit si une erreur de lint/formatage est détectée.

- **pre-push** :
  - Exécute tous les tests unitaires (back et front).
  - Bloque le push si un test échoue.

#### Commandes utiles

À la racine du projet :

| Commande | Description |
|----------|-------------|
| `npm run lint` | Lint tous les services avec Biome |
| `npm run format` | Formate tout le code avec Biome |
| `npm run lint:writer-front` | Lint uniquement le frontend Writer |
| `npm run lint:writer-back` | Lint uniquement le backend Writer |
| `npm run lint:reader-front` | Lint uniquement le frontend Reader |
| `npm run lint:reader-back` | Lint uniquement le backend Reader |
| `npm run format:writer-front` | Formate uniquement le frontend Writer |
| `npm run format:writer-back` | Formate uniquement le backend Writer |
| `npm run format:reader-front` | Formate uniquement le frontend Reader |
| `npm run format:reader-back` | Formate uniquement le backend Reader |

#### Exemple de workflow

1. **Avant commit** :
   - Modifiez vos fichiers, puis faites `git add ...`
   - Lors du `git commit`, Husky lance automatiquement Biome sur les fichiers modifiés.
   - Si une erreur est détectée, le commit est annulé.

2. **Avant push** :
   - Lors du `git push`, Husky lance tous les tests unitaires.
   - Si un test échoue, le push est annulé.

#### Bypass (à éviter)

Pour ignorer temporairement les hooks (ex : urgence) :
```bash
git commit --no-verify -m "message"
git push --no-verify
```
> ⚠️ À utiliser avec précaution, car cela contourne les garde-fous qualité.

---

## 🚀 Déploiement sur Render.com

### Déploiement automatisé avec Blueprint

Le projet est configuré pour un déploiement automatique sur Render.com via le fichier [render.yaml](render.yaml).

**Services déployés :**
- 🗄️ PostgreSQL Database (gratuit 90 jours)
- 🔧 Writer Backend (API Node.js)
- 🔧 Reader Backend (API Node.js)
- 🎨 Writer Frontend (Next.js)
- 🎨 Reader Frontend (Next.js)

**Plan gratuit Render :**
- ✅ Idéal pour portfolio et démonstration
- ⚠️ Services "spin down" après 15 min d'inactivité (premier appel : 30-60s)
- ⚠️ PostgreSQL gratuit expire après 90 jours

### Guide de déploiement complet

📖 **Consultez le guide détaillé : [DEPLOY_RENDER.md](DEPLOY_RENDER.md)**

**Résumé des étapes :**

1. **Connecter le repository à Render**
   - Dashboard Render > New > Blueprint
   - Connecter votre repository GitHub
   - Render détecte automatiquement `render.yaml`

2. **Initialiser la base de données**
   ```bash
   # Depuis votre terminal local
   export DATABASE_URL="postgres://...@dpg-xxx.oregon-postgres.render.com/db_writer"
   ./init-db-render.sh
   ```

3. **Mettre à jour les URLs des services**
   - Noter les URLs générées par Render pour chaque service
   - Mettre à jour les variables d'environnement :
     - `NEXT_PUBLIC_API_URL` dans les frontends
     - `CLIENT_URL` dans les backends (pour CORS)

4. **Tester l'application déployée**
   - Ouvrir les URLs des frontends dans votre navigateur
   - Créer un article sur Writer Frontend
   - Vérifier qu'il apparaît sur Reader Frontend

### URLs de production

Une fois déployé, vous aurez des URLs du type :
- Writer Frontend : `https://writer-frontend-xxx.onrender.com`
- Reader Frontend : `https://reader-frontend-xxx.onrender.com`
- Writer Backend : `https://writer-backend-xxx.onrender.com/api/articles`
- Reader Backend : `https://reader-backend-xxx.onrender.com/api/articles`

### Scripts utiles

| Script | Description |
|--------|-------------|
| `./init-db-render.sh` | Initialise le schéma PostgreSQL sur Render |
| `render.yaml` | Configuration Blueprint pour déploiement automatique |
| `.renderignore` | Fichiers à exclure du déploiement |

### Troubleshooting déploiement

Consultez la section "Dépannage" dans [DEPLOY_RENDER.md](DEPLOY_RENDER.md) pour résoudre les problèmes courants.

---

N'hésitez pas à compléter ce README au fur et à mesure de l'avancement du projet.
