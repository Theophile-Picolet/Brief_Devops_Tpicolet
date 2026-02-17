# Backend - Documentation

## 🚀 Initialisation

1. **Créer le fichier `.env`** à la racine de `back/`
   ```env
   PORT=3001
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

Le serveur démarre sur `http://localhost:3001`

---

## 📁 Structure du projet

```
back/code/
├── index.ts              # Point d'entrée (serveur Express, CORS)
├── controller/           # Gestion des requêtes/réponses
├── router/              # Définition des routes
└── service/             # Logique métier
```

---

## 🔌 Endpoints

**Base URL:** `/api/articles`

| Méthode | Route | Query params | Description |
|---------|-------|--------------|-------------|
| `GET` | `/` | `recent`, `limit` | Liste tous les articles |
| `GET` | `/:id` | - | Récupère un article par ID |

### Exemples
```bash
GET /api/articles                    # Tous les articles
GET /api/articles?recent=true        # Articles triés par date (récents en premier)
GET /api/articles?limit=5            # Limiter à 5 articles
GET /api/articles?recent=true&limit=3 # 3 articles les plus récents
GET /api/articles/1                  # Article avec ID 1
```

---

## ⚠️ Gestion d'erreurs

### Codes HTTP
- **200** : Succès
- **400** : Paramètres invalides
- **404** : Ressource non trouvée
- **500** : Erreur serveur

### Cas d'erreurs fréquents
- `limit` doit être un nombre positif
- `id` doit être un nombre positif valide
- Retourne 404 si aucun article ou article introuvable

---

## 🔧 Configuration CORS

Le serveur accepte uniquement les requêtes depuis `http://localhost:3000` 