# test.README.md — Guide complet et avancé des tests

---

## 0. Structure des tests dans ce projet

Ce projet contient deux modules principaux (`wn-jjklrt-read-dev` pour la lecture et `wn-jjklrt-write-dev` pour l'écriture), chacun avec ses propres tests backend et frontend.

### Cartographie des fichiers de test

| Fichier | Type | Module |
|---|---|---|
| `wn-jjklrt-read-dev/back/code/routes/article-api.test.ts` | Intégration (Supertest) | Back lecture |
| `wn-jjklrt-write-dev/write-back/src/routes/article-api.test.ts` | Intégration (Supertest) | Back écriture |
| `wn-jjklrt-write-dev/write-back/src/services/article-service.test.ts` | Unitaire (Jest + `spyOn`) | Back écriture |
| `wn-jjklrt-read-dev/front/tests/article-navigation.spec.ts` | E2E (Playwright) | Front lecture |
| `wn-jjklrt-read-dev/front/tests/category-filter.spec.ts` | E2E (Playwright) | Front lecture |
| `wn-jjklrt-read-dev/front/tests/global-navigation.spec.ts` | E2E (Playwright) | Front lecture |
| `wn-jjklrt-write-dev/write-front/tests/article-e2e.spec.ts` | E2E (Playwright) | Front écriture |

### Fichier `.env.test` (obligatoire pour les tests d'intégration et unitaires)

Les tests Jest chargent automatiquement un fichier `.env.test` via :
```typescript
dotenv.config({ path: ".env.test" });
```
Ce fichier **ne doit pas être commité** et doit être créé manuellement dans le dossier back de chaque module (`wn-jjklrt-read-dev/back/` et `wn-jjklrt-write-dev/write-back/`).

Variables à renseigner (adapter selon votre configuration) :
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=motdepasse
DB_NAME=nom_de_la_base_de_test
```

### ⚠️ Prérequis Docker — obligatoire avant tout test, commit ou push

**Tous les tests d'intégration et E2E nécessitent que les conteneurs Docker soient démarrés.** Sans cela, les tests échoueront et le push sera bloqué par le hook pre-push.

| Type de test | Conteneur requis | Port |
|---|---|---|
| Intégration Jest (back) | `database-test` | 5433 |
| E2E Playwright (reader) | `database` + `reader-back` + `reader-front` | 5432, 8002, 3000 |
| E2E Playwright (writer) | `database` + `writer-back` + `writer-front` | 5432, 8001, 3001 |

**Commande à lancer avant de travailler, de tester, ou de pousser :**
```bash
# Depuis la racine du projet
docker compose up -d
```

Cela démarre tous les services en arrière-plan. Vérifier qu'ils sont prêts :
```bash
docker compose ps
```

> Le hook `.husky/pre-push` lance automatiquement tous les tests (Jest + Playwright) avant chaque push. Si les conteneurs ne sont pas démarrés, il affiche un message d'erreur et bloque le push.

### Commandes pour lancer les tests du projet

```bash
# Depuis la racine — tous les tests Jest (unitaires + intégration)
npm run test:unit

# Depuis la racine — tous les tests E2E Playwright
npm run test:e2e

# Depuis la racine — tout (Jest + Playwright, équivalent au pre-push)
npm test

# Par module uniquement
cd wn-jjklrt-read-dev/back && npm test        # intégration back lecture
cd wn-jjklrt-write-dev/write-back && npm test  # unitaire + intégration back écriture
cd wn-jjklrt-read-dev/front && npx playwright test        # E2E front lecture
cd wn-jjklrt-write-dev/write-front && npx playwright test  # E2E front écriture
```

---

## 1. Introduction générale

Pourquoi écrit-on des tests ?
- Pour garantir la qualité, éviter les bugs, faciliter les évolutions.
- Les tests sont comme des vérifications : chaque brique du projet doit fonctionner seule et avec les autres.

Quels types de tests ?
- **Tests unitaires** : vérifient une fonction ou méthode isolée.
- **Tests d'intégration** : vérifient que plusieurs briques fonctionnent ensemble (API, DB, routes).
- **Tests end-to-end (E2E)** : vérifient le parcours complet de l'utilisateur, du front au back.

Pourquoi plusieurs types ?
- Chaque type répond à une question différente :
  - Unitaire : "Ma fonction fait-elle ce qu'elle doit ?"
  - Intégration : "Mon API répond-elle correctement ?"
  - E2E : "L'utilisateur peut-il accomplir sa tâche sans erreur ?"

---

## 2. Tests unitaires avec Jest

### Philosophie
Les tests unitaires sont la base de la pyramide des tests. Ils garantissent que chaque fonction ou méthode fait ce qu'on attend, sans influence extérieure.

### Installation
```bash
npm install --save-dev jest @types/jest ts-jest
```
Pour TypeScript :
```bash
npx ts-jest config:init
```
Pour Babel :
```bash
npm install --save-dev babel-jest @babel/core @babel/preset-env
```
Pour les tests de composants React (utilisé dans ce projet via `jest.setup.js`) :
```bash
npm install --save-dev @testing-library/jest-dom
```
Et dans le fichier de setup Jest (`jest.setup.js`) :
```javascript
import "@testing-library/jest-dom";
```

### Configuration
- Générer un fichier de config : `npm init jest@latest`
- Pour TypeScript, utiliser `ts-jest` ou Babel.
- Ajouter dans `package.json` :
```json
"scripts": {
  "test": "jest"
}
```

### Structure d’un test
```typescript
// src/utils/math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// src/utils/math.test.ts
import { add } from './math';

describe('add', () => {
  it('additionne deux nombres', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```
- Utilise `describe` pour regrouper des tests, `it` ou `test` pour chaque cas.
- `expect` permet d’exprimer des assertions ([matchers](https://jestjs.io/docs/using-matchers)).

### Exemples avancés
#### Mock de fonction
```typescript
import { fetchData } from './api';
jest.mock('./api');

it('utilise le mock', async () => {
  (fetchData as jest.Mock).mockResolvedValue('mocked');
  const result = await fetchData();
  expect(result).toBe('mocked');
});
```

#### Setup/Teardown
```typescript
beforeAll(() => {/* setup global */});
beforeEach(() => {/* setup avant chaque test */});
afterEach(() => {/* cleanup après chaque test */});
afterAll(() => {/* cleanup global */});
```

#### Test de cas d’erreur
```typescript
it('lève une erreur', () => {
  expect(() => {
    throw new Error('fail');
  }).toThrow('fail');
});
```

### Commandes
- Lancer tous les tests : `npm test` ou `npx jest`
- Lancer un test précis : `npx jest src/utils/math.test.ts`
- Générer un rapport de couverture : `npx jest --coverage`
- Notifications OS : `jest --notify`

### Mocks et isolation
- Utiliser `jest.mock` pour simuler des modules externes.
- Utiliser `jest.spyOn` pour surveiller ou remplacer une méthode d'un objet réel, sans remplacer tout le module (idéal pour mocker des requêtes DB sans connexion réelle).
- Voir [Mock Functions](https://jestjs.io/docs/mock-functions).

#### Exemple : mock de requête base de données avec `jest.spyOn`
```typescript
// Exemple issu de write-back/src/services/article-service.test.ts
import { jest } from "@jest/globals";
import Pg from "../config/client";
import ArticleRepository from "./article-service";

it("retourne l'article si trouvé", async () => {
  const fakeArticle = { title: "Fake Title", sub_title: "Fake Subtitle", /* ... */ };
  // On surveille Pg.query et on force son retour sans toucher la vraie DB
  jest.spyOn(Pg, "query").mockResolvedValueOnce({ rows: [fakeArticle] });
  const result = await ArticleRepository.readByTitle("Fake Title");
  expect(result).toEqual(fakeArticle);
});
```

### Setup/Teardown
- Utiliser `beforeAll`, `beforeEach`, `afterAll`, `afterEach` pour préparer ou nettoyer l’environnement de test.

### Troubleshooting
- Vérifier la config Jest (`jest.config.js` ou `package.json`).
- Utiliser `--verbose` pour plus de détails.
- Consulter [Jest CLI Options](https://jestjs.io/docs/cli).

### Liens utiles
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [API Reference](https://jestjs.io/docs/api)
- [Snapshot Testing](https://jestjs.io/docs/snapshot-testing)
- [Community](https://jestjs.io/community)

---

## 3. Tests d’intégration avec Supertest

### Philosophie
Les tests d’intégration vérifient que les composants communiquent bien entre eux (API, DB, routes). Ils simulent des requêtes HTTP comme le ferait un client.

### Installation
```bash
npm install --save-dev supertest
```

### Structure d’un test
```typescript
import request from 'supertest';
import app from '../index';

describe('GET /api/articles', () => {
  it('retourne un tableau d\'articles', async () => {
    const res = await request(app).get('/api/articles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
```
- Utilise `request(app)` pour simuler des requêtes HTTP.
- Chaine les méthodes `.get`, `.post`, `.send`, `.set`, `.expect`.

### Exemples avancés
#### Authentification
```typescript
request(app)
  .get('/user')
  .auth('username', 'password')
  .expect(200);
```

#### Test de cookies
```typescript
request(app)
  .get('/users')
  .set('Cookie', ['nameOne=valueOne;nameTwo=valueTwo'])
  .expect(200);
```

#### Test multipart/upload
```typescript
request(app)
  .post('/')
  .field('name', 'avatar')
  .attach('avatar', 'test/fixtures/avatar.jpg')
  .expect(200);
```

#### Utilisation de promesses ou async/await
```typescript
it('répond avec json', async () => {
  const response = await request(app)
    .get('/users')
    .set('Accept', 'application/json');
  expect(response.status).toBe(200);
  expect(response.body.email).toEqual('foo@bar.com');
});
```

### Setup/Teardown
- Utiliser `beforeAll`/`afterAll` pour démarrer ou fermer la base de données ou le serveur.

### Troubleshooting
- Vérifier que l’app Express est bien exportée.
- Utiliser `console.log(res.body)` pour inspecter les réponses.
- Consulter [Supertest README](https://github.com/visionmedia/supertest#readme).

### Liens utiles
- [Supertest Docs](https://github.com/visionmedia/supertest#readme)
- [Superagent API](https://forwardemail.github.io/superagent/)
- [Examples](https://github.com/visionmedia/supertest#example)

---

## 4. Tests end-to-end (E2E) avec Playwright

### Philosophie
Les tests E2E valident le parcours utilisateur complet, sur plusieurs navigateurs. Ils garantissent que l’expérience utilisateur est conforme.

### Installation
```bash
npm init playwright@latest
```
- Choisir TypeScript ou JavaScript, installer les navigateurs, configurer le dossier de tests.

### Structure d’un test
```typescript
import { test, expect } from '@playwright/test';

test('navigation vers la page article', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Articles');
  expect(page.url()).toContain('/articles');
});
```
- Utilise `test` pour chaque scénario, `expect` pour assertions.
- Utilise `page` pour interagir avec le navigateur (clics, navigation, remplissage).

### Exemples avancés
#### Remplir un formulaire et valider
```typescript
test('remplir et valider formulaire', async ({ page }) => {
  await page.goto('http://localhost:3000/contact');
  await page.fill('input[name="email"]', 'test@mail.com');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success')).toBeVisible();
});
```

#### Prendre une capture d’écran
```typescript
test('screenshot', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'homepage.png' });
});
```

#### Tester plusieurs navigateurs
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
```

### Commandes
- Lancer tous les tests : `npx playwright test`
- Lancer un test précis : `npx playwright test tests/example.spec.ts`
- Mode UI : `npx playwright test --ui`
- Rapport HTML : `npx playwright show-report`
- Headed mode : `npx playwright test --headed`
- Filtrer par navigateur : `--project=chromium`

### Avancé
- Utiliser [fixtures](https://playwright.dev/docs/test-fixtures) pour setup/teardown.
- Utiliser [Codegen](https://playwright.dev/docs/codegen-intro) pour générer des tests.
- Utiliser [traces](https://playwright.dev/docs/trace-viewer-intro) pour déboguer.
- **Isolation des données de test** : pour éviter les conflits entre exécutions (notamment en CI), générer des identifiants uniques avec `Date.now()` :
```typescript
// Exemple issu de write-front/tests/article-e2e.spec.ts
const uniqueTitle = `Article Playwright ${Date.now()}`;
// Ce titre unique est ensuite utilisé pour créer, puis éditer/supprimer l'article dans le même run
```

### Troubleshooting
- Vérifier la config dans `playwright.config.ts`.
- Consulter [Running Tests](https://playwright.dev/docs/running-tests).
- Utiliser la communauté Discord, Stack Overflow.

### Liens utiles
- [Playwright Docs](https://playwright.dev/docs/intro)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Playwright Training](https://learn.microsoft.com/en-us/training/modules/build-with-playwright/)
- [Community](https://playwright.dev/community)

---

## 5. Conseils et bonnes pratiques

- Toujours isoler les tests unitaires, mocker les dépendances.
- Tester les cas limites, erreurs, et succès.
- Utiliser la couverture pour repérer les zones non testées.
- Relire les rapports, utiliser les snapshots pour valider le rendu.
- Documenter chaque test, nommer clairement les fichiers et fonctions.
- Utiliser CI/CD pour automatiser les tests à chaque push.

---

## 6. Commandes utiles

### Commandes génériques
- Lancer tous les tests : `npm test`
- Lancer un test précis : `npx jest src/utils/math.test.ts`
- Lancer les tests E2E : `npx playwright test`
- Générer un rapport de couverture : `npx jest --coverage`

### Commandes spécifiques à ce projet
> Voir aussi la section **0** pour les prérequis (`.env.test`, serveurs à démarrer).
```bash
# Tests d'intégration — back lecture
cd wn-jjklrt-read-dev/back && npm test

# Tests unitaires et d'intégration — back écriture
cd wn-jjklrt-write-dev/write-back && npm test

# Tests E2E — front lecture (nécessite les serveurs démarrés)
cd wn-jjklrt-read-dev/front && npx playwright test

# Tests E2E — front écriture (nécessite les serveurs démarrés)
cd wn-jjklrt-write-dev/write-front && npx playwright test
```

---

## 7. Ressources complémentaires

- [Jest CLI Options](https://jestjs.io/docs/cli)
- [Supertest Examples](https://github.com/visionmedia/supertest#example)
- [Playwright UI Mode](https://playwright.dev/docs/test-ui-mode)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer-intro)

---

## 8. Conclusion

Les tests sont essentiels pour tout projet sérieux. Ils permettent d'apprendre, de progresser, et de collaborer sereinement. Prends le temps d'écrire des tests, c'est le meilleur investissement pour ton code !
