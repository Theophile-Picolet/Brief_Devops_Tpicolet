# News DevOps Tpicolet

## Présentation du projet

Ce projet est une application composée de deux microservices (reader et writer), chacun avec un frontend (Next.js/React) et un backend (Node.js). L'orchestration se fait via Docker Compose, avec une base de données PostgreSQL partagée.

## Cloner le projet

Pour récupérer le code source :

- Ouvrez un terminal
- Tapez la commande suivante :

```bash
git clone <url-du-repo>
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

## Sécurité

- Le fichier `.env` ne doit jamais être versionné (voir `.gitignore`).
- Utilisez toujours `.env.example` pour partager la structure attendue des variables.

---

N'hésitez pas à compléter ce README au fur et à mesure de l'avancement du projet (tests, hooks, CI/CD, déploiement, etc.).
