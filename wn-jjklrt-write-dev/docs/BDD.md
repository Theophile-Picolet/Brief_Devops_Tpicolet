# Modèle de base de données – World News – WRITE (`bdd_write.md`)

Ce document décrit le modèle de données utilisé par la partie **WRITE** du projet **World News**, basé sur la table `articles` ci-dessous :

- PK : `title`
- Colonnes : `title`, `sub_title`, `article_lead`, `body`, `categorie`, `published_at`

---

## 1. MCD – Modèle Conceptuel de Données (WRITE)

### Entité ARTICLE

**ARTICLE**

- Identifiant : `title`
- Attributs :
  - `title` : titre de l’article (identifiant unique)
  - `sub_title` : sous-titre de l’article
  - `article_lead` : chapeau (résumé en début d’article)
  - `body` : corps de l’article
  - `categorie` : catégorie de l’article
  - `published_at` : date et heure de publication

Dans cette version WRITE :
- le titre de l’article sert d’**identifiant métier**,
- les journalistes ne sont pas modélisés (un seul “journaliste courant” géré applicativement).

---

## 2. MLD – Modèle Logique de Données (relationnel – WRITE)

Schéma relationnel :

    ARTICLES (
      title,         -- PK
      sub_title,
      article_lead,
      body,
      categorie,
      published_at
    )

### 2.1. Clé primaire (PK)

- `ARTICLES` : `title`

### 2.2. Contraintes métier (WRITE)

- `title` : NOT NULL, UNIQUE  
- `sub_title` : NOT NULL  
- `article_lead` : NOT NULL  
- `body` : NOT NULL  
- `categorie` : NOT NULL
- `published_at` : NOT NULL  

Ces contraintes permettent de respecter les règles du cahier des charges :
- tous les champs sont obligatoires,
- le titre identifie de façon unique chaque article,
- la date de publication est toujours renseignée.

---

## 3. MPD – Modèle Physique de Données (PostgreSQL – WRITE)

### Table `articles`

Script SQL de création de la table correspondant au MLD :

    CREATE TABLE articles (
      title         VARCHAR(300)   PRIMARY KEY,
      sub_title     VARCHAR(300)   NOT NULL,
      article_lead  VARCHAR(1000)  NOT NULL,
      body          VARCHAR(10000) NOT NULL,
      categorie     VARCHAR(100)   NOT NULL,
      published_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

Remarques :

- `title` est la **clé primaire** et doit donc être unique.
- Les longueurs (`VARCHAR(300)`, `VARCHAR(1000)`, `VARCHAR(10000)`) respectent les contraintes fonctionnelles.
- `published_at` est rempli par le microservice WRITE au moment de la création ou de la modification.

---

## 4. Lien avec les user stories WRITE

- **US1 – Rédiger un article**  
  `INSERT` dans `articles` avec :  
  `title`, `sub_title`, `article_lead`, `body`, `published_at`.

- **US2 – Retrouver un article (pour édition)**  
  sélection d’un article par `title` dans la table `articles`.

- **US3 – Éditer un article**  
  `UPDATE` de la ligne `articles` identifiée par `title`,  
  pour modifier `sub_title`, `article_lead`, `body`, et mettre à jour `published_at`