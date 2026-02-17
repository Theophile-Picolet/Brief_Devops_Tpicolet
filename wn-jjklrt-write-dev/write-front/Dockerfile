# === ÉTAPE 1 : Choisir l'image de base ===
# Next.js nécessite aussi Node.js pour le SSR (Server-Side Rendering)
# On utilise la même image Alpine légère que pour le backend
FROM node:20-alpine

# === ÉTAPE 2 : Définir le répertoire de travail ===
# Tous les fichiers iront dans /app
# Toutes les commandes s'exécuteront depuis /app
WORKDIR /app

# === ÉTAPE 3 : Copier UNIQUEMENT les fichiers de dépendances ===
# On copie d'abord package*.json pour profiter du cache Docker
# Si les dépendances ne changent pas, cette couche est réutilisée
COPY package*.json ./

# === ÉTAPE 4 : Installer les dépendances ===
# npm ci = installation propre et déterministe
# Installe React, Next.js, Tailwind, TypeScript, etc.
RUN npm ci

# === ÉTAPE 5 : Copier tout le code source ===
# On copie maintenant le code Next.js : src/app/, public/, next.config.ts, etc.
# Le ".next" build sera créé à l'étape suivante
COPY . .

# === ÉTAPE 6 : Build de l'application Next.js ===
# "next build" compile et optimise l'application pour la production
# Crée le dossier .next/ avec les pages pré-rendues et le code optimisé
# Cette étape prend plus de temps que la compilation TypeScript simple
RUN npm run build

# === ÉTAPE 7 : Exposer le port ===
# Next.js utilise le port 3000 par défaut
# EXPOSE est documentaire : le vrai mapping se fait dans Docker Compose
EXPOSE 3000

# === ÉTAPE 8 : Commande de démarrage ===
# "next start" lance le serveur Next.js en mode production
# Il sert les pages depuis le dossier .next/ créé au build
CMD ["npm", "start"]
