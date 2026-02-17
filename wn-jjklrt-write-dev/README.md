# Cahier des charges – Projet World News (WRITE)

## 1. Contexte et objectif

World News est un groupe de presse produisant des articles d’actualité.  
L’application interne actuelle est **monolithique** et difficile à faire évoluer (maintenance, évolutivité, travail en équipe).

**Objectif du projet :**  
Réaliser un **prototype WRITE (écriture)** d’application interne basé sur une architecture **microfrontend + microservice**, afin de :

- permettre aux **journalistes** de créer, modifier et gérer leurs articles ;
- démontrer la pertinence d’une séparation claire des responsabilités côté écriture.

Le but est de **démontrer l’architecture WRITE**, pas de livrer un produit final complet.

---

## 2. Périmètre fonctionnel – Journalistes (WRITE)

### US1 – Rédiger un article

> En tant que journaliste, je peux créer un article avec :
> - un titre  
> - un sous-titre  
> - un chapeau  
> - un corps  

**Exigences :**

- Tous ces champs sont **obligatoires**.
- L’article est enregistré en base de données.
- La date de publication est générée automatiquement.

---

### US2 – Retrouver un article

> En tant que journaliste, je peux consulter la liste de mes articles.

**Exigences :**

- La liste affiche au minimum :
  - le **titre** ;
  - la **date de publication**.
- Les articles sont **triés par date de publication décroissante**.
- Un clic sur un article permet d’accéder à son édition.

---

### US3 – Éditer un article

> En tant que journaliste, je peux modifier un article existant.

**Exigences :**

- Le journaliste accède à un **formulaire pré-rempli**.
- Il peut modifier :
  - le titre,
  - le sous-titre,
  - le chapeau,
  - le corps.
- La **date de publication** est mise à jour lors de la sauvegarde.

---

## 3. Règles métier (WRITE)

- Champs **obligatoires** pour un article :
  - titre,
  - sous-titre,
  - chapeau,
  - corps.
- **Contraintes de longueur :**
  - titre : ≤ 300 caractères, **unique** ;
  - sous-titre : ≤ 300 caractères ;
  - chapeau : ≤ 1 000 caractères ;
  - corps : ≤ 10 000 caractères.
- **Date de publication :**
  - non saisie par l’utilisateur ;
  - générée automatiquement à la création ou à la modification.
- Pas de gestion de brouillon dans ce prototype WRITE.

---

## 4. Exigences techniques – WRITE

### Architecture

- 1 **microfrontend Journaliste (WRITE)** ;
- 1 **microservice WRITE** (création / modification / listing d’articles).

### Communication

- API REST en **JSON** entre le microfrontend et le microservice WRITE.

### Base de données

- SGBD : **PostgreSQL** ;
- Modélisation selon une démarche **MERISE** (MCD → MLD → MPD) ;
- Tables principales :
  - `articles` ;

---

## 5. Checklist technique – WRITE

### 🖥️ Front-end (Journaliste)

- [x] Initialiser le projet avec Next.js :
  - [x] `npx create-next-app@latest`
- [x] Utiliser **TypeScript**
- [x] Configurer **Biome** (linting & formatage)

---

### ⚙️ Back-end (WRITE – Node.js / Express)

#### Initialisation

- [x] Installer Express : `npm i express`
- [x] Installer les types Express : `npm i --save-dev @types/express`
- [x] Installer dotenv : `npm i dotenv`
- [x] Installer les types Node : `npm i --save-dev @types/node`

#### Base de données

- [x] Installer PostgreSQL : `npm i postgres`
- [x] Installer pg et ses types : `npm install pg @types/pg`
- [x] Créer les fichiers de connexion :
  - [x] `client.ts`
  - [x] `checkConnexion.ts`

#### Configuration & outils

- [x] Créer le fichier `.env`
- [x] Créer le fichier principal `index.ts`
- [x] Créer les scripts de lancement dans `package.json`
- [x] Créer le fichier `tsconfig.json`
- [x] Installer tsx : `npm install --save-dev tsx`
- [x] Installer Joi pour la validation des données : `npm i joi`

---

## 6. Critères de réussite – WRITE

Le prototype WRITE est considéré comme **validé** si :

- un journaliste peut **créer** un article conforme aux règles métier ;
- un journaliste peut **consulter la liste** de ses articles ;
- un journaliste peut **modifier** un article existant ;
- l’API WRITE est **fonctionnelle, séparée et cohérente** ;
- la base de données respecte le périmètre défini.