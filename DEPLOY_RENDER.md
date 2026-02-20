# 🚀 Guide de déploiement sur Render.com

## 📋 Prérequis

- Compte GitHub avec le repository public ou privé
- Compte Render.com (gratuit) : https://render.com
- PostgreSQL client installé localement (pour initialiser la BDD)

## 🎯 Architecture déployée

```
Render.com
├─ PostgreSQL Database (gratuit 90 jours)
│  └─ URL: postgres://...@dpg-xxx.oregon-postgres.render.com/db_writer
│
├─ Writer Backend (Web Service - Node.js)
│  └─ URL: https://writer-backend.onrender.com
│
├─ Reader Backend (Web Service - Node.js)
│  └─ URL: https://reader-backend.onrender.com
│
├─ Writer Frontend (Web Service - Next.js)
│  └─ URL: https://writer-frontend.onrender.com
│
└─ Reader Frontend (Web Service - Next.js)
   └─ URL: https://reader-frontend.onrender.com
```

## 🔧 Étape 1 : Préparation du Blueprint

Le fichier `render.yaml` à la racine du projet contient la configuration complète.

**Points importants :**
- Plan gratuit : Les services "spin down" après 15 min d'inactivité
- Premier appel après inactivité : ~30-60 secondes de latence
- PostgreSQL gratuit : Expire après 90 jours (migrer vers plan payant après)

## 🌐 Étape 2 : Connexion à Render

1. Allez sur https://dashboard.render.com
2. Cliquez sur "New +" > "Blueprint"
3. Connectez votre repository GitHub
4. Recherchez "News_Devops_Tpicolet" (ou le nom de votre repo)
5. Cliquez sur "Connect"

Render va automatiquement :
- Détecter le fichier `render.yaml`
- Créer la base PostgreSQL
- Créer les 4 services (2 backends, 2 frontends)
- Configurer les variables d'environnement

## 🗄️ Étape 3 : Initialisation de la base de données

**Important :** Render ne peut pas exécuter de scripts SQL automatiquement au déploiement initial.
Vous devez initialiser manuellement la base de données.

### Option A : Depuis l'interface Render Dashboard

1. Allez dans Dashboard > `news-devops-db` (votre base PostgreSQL)
2. Cliquez sur "Connect" > "External Connection"
3. Copiez la commande PSQL (format: `psql postgres://...`)
4. Dans votre terminal local, exécutez :

```bash
# Aller à la racine du projet
cd /chemin/vers/News_Devops_Tpicolet

# Exporter l'URL de connexion (remplacez par votre URL Render)
export DATABASE_URL="postgres://postgres:xxx@dpg-xxx.oregon-postgres.render.com/db_writer"

# Exécuter le script d'initialisation
./init-db-render.sh
```

### Option B : Exécution manuelle étape par étape

```bash
# 1. Schéma Writer (tables)
psql $DATABASE_URL -f wn-jjklrt-write-dev/database/schema.sql

# 2. Migrations Reader (vues)
psql $DATABASE_URL -f wn-jjklrt-read-dev/back/data/migrations/001_create_articles_lecture_view.sql
psql $DATABASE_URL -f wn-jjklrt-read-dev/back/data/migrations/002_create_create_comments_table.sql
psql $DATABASE_URL -f wn-jjklrt-read-dev/back/data/migrations/003_create_readers_and_favorites_tables.sql

# 3. Vérification
psql $DATABASE_URL -c "\dt"
```

## 🔗 Étape 4 : Mise à jour des URLs des services

Après le premier déploiement, Render génère des URLs pour chaque service.

### 4.1 Noter les URLs générées

Exemple :
- Writer Backend: `https://writer-backend-abc123.onrender.com`
- Reader Backend: `https://reader-backend-def456.onrender.com`
- Writer Frontend: `https://writer-frontend-ghi789.onrender.com`
- Reader Frontend: `https://reader-frontend-jkl012.onrender.com`

### 4.2 Mettre à jour les variables d'environnement

#### Dans le Dashboard Render :

**Writer Frontend** :
- `NEXT_PUBLIC_API_URL` = URL du Writer Backend

**Reader Frontend** :
- `NEXT_PUBLIC_API_URL` = URL du Reader Backend

**Reader Backend** :
- `CLIENT_URL` = URL du Reader Frontend (pour CORS)

**Writer Backend** :
- `CLIENT_URL` = URL du Writer Frontend (pour CORS)

### 4.3 Redéployer les services

Après avoir modifié les variables d'environnement :
- Cliquez sur "Manual Deploy" > "Deploy latest commit" pour chaque service

## ✅ Étape 5 : Vérification du déploiement

### 5.1 Tester les backends

```bash
# Writer Backend
curl https://writer-backend-xxx.onrender.com/api/articles

# Reader Backend
curl https://reader-backend-xxx.onrender.com/api/articles
```

Vous devriez recevoir un tableau JSON avec les articles.

### 5.2 Tester les frontends

Ouvrez dans votre navigateur :
- Writer Frontend: `https://writer-frontend-xxx.onrender.com`
- Reader Frontend: `https://reader-frontend-xxx.onrender.com`

### 5.3 Tester l'ajout d'un article

1. Allez sur Writer Frontend
2. Créez un nouvel article
3. Allez sur Reader Frontend
4. Vérifiez que l'article apparaît

## 🔍 Dépannage (Troubleshooting)

### Service ne démarre pas

**Erreur commune :** `Application failed to respond`
- ✅ Vérifiez les logs dans Dashboard > Service > Logs
- ✅ Vérifiez que `npm start` fonctionne localement
- ✅ Assurez-vous que le port est bien `3001` (ou celui défini dans ENV)

### Erreur de connexion à la base de données

**Erreur commune :** `ECONNREFUSED` ou `connection timeout`
- ✅ Vérifiez que la base est bien déployée et "Available"
- ✅ Vérifiez les variables d'environnement `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`
- ✅ Attendez 2-3 minutes après le premier déploiement (temps de provisionnement)

### Frontend ne se connecte pas au backend

**Erreur commune :** `Failed to fetch` ou CORS error
- ✅ Vérifiez que `NEXT_PUBLIC_API_URL` pointe vers le bon backend
- ✅ Vérifiez que le backend a configuré CORS correctement
- ✅ Vérifiez que `CLIENT_URL` dans le backend correspond au frontend

### Service trop lent (cold start)

C'est normal avec le plan gratuit :
- Premier appel après 15 min d'inactivité : ~30-60 secondes
- Solution : Passer au plan payant ($7/mois) pour garder le service actif

## 📊 Monitoring et logs

### Visualiser les logs

Dans le Dashboard Render :
1. Cliquez sur un service
2. Onglet "Logs" (en temps réel)
3. Filtrer par niveau : Info, Warning, Error

### Métriques

Dashboard > Service > Metrics :
- CPU Usage
- Memory Usage
- Request Rate
- Response Time

## 🔄 Déploiement continu (CI/CD)

Render se synchronise automatiquement avec GitHub :
- À chaque push sur `main`, Render redéploie automatiquement
- Les tests GitHub Actions s'exécutent AVANT le déploiement
- Si les tests échouent, le déploiement n'a pas lieu

## 💰 Coûts

### Plan Gratuit (actuel)
- Web Services : Gratuit (avec spin down)
- PostgreSQL : Gratuit 90 jours (puis $7/mois minimum)
- Limite : 750 heures/mois cumulées pour tous les services

### Passage au plan payant (optionnel)
- Web Service Starter : $7/mois par service (pas de spin down)
- PostgreSQL : $7/mois (1 Go RAM, 1 Go stockage)
- **Total estimé : ~$35/mois** (1 BDD + 4 services)

## 🎉 Félicitations !

Votre application est maintenant déployée en production sur Render !

**URLs finales à partager :**
- Writer Frontend : `https://writer-frontend-xxx.onrender.com`
- Reader Frontend : `https://reader-frontend-xxx.onrender.com`

**Prochaines étapes :**
- Configurer un nom de domaine personnalisé
- Activer SSL/TLS (automatique sur Render)
- Configurer des alertes (monitoring)
- Planifier la migration de la BDD après 90 jours
