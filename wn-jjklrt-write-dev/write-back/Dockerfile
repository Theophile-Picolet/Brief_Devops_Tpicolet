# === ÉTAPE 1 : Choisir l'image de base ===
# On part d'une image officielle qui contient déjà Node.js installé
# "node:20-alpine" = Node.js version 20, sur Alpine Linux (version ultra-légère)
# Alpine = distribution Linux minimaliste (~5MB vs ~900MB pour Ubuntu)
FROM node:20-alpine

# === ÉTAPE 2 : Définir le répertoire de travail ===
# Tous les fichiers qu'on copie iront dans /app
# Toutes les commandes qu'on exécute se feront depuis /app
# C'est comme faire "cd /app" au début de chaque commande
WORKDIR /app

# === ÉTAPE 3 : Copier UNIQUEMENT les fichiers de dépendances ===
# On copie d'abord package*.json pour profiter du cache Docker
# Si ces fichiers ne changent pas, Docker réutilisera cette couche (gain de temps énorme)
# Le "./" à la fin signifie "copier dans le répertoire courant" (/app)
COPY package*.json ./

# === ÉTAPE 4 : Installer les dépendances ===
# npm ci = "clean install" (plus rapide et déterministe que npm install)
# Utilise le package-lock.json pour installer exactement les mêmes versions
# RUN = exécute une commande PENDANT la construction de l'image
RUN npm ci

# === ÉTAPE 5 : Copier tout le code source ===
# Maintenant qu'on a les dépendances installées dans node_modules,
# on copie tout le reste du code (src/, tsconfig.json, .env, etc.)
# Le premier "." = tout dans le dossier où se trouve le Dockerfile
# Le deuxième "." = destination (/app)
COPY . .

# === ÉTAPE 6 : Compiler TypeScript → JavaScript ===
# On lance la commande "build" définie dans package.json
# Cela exécute "tsc" qui compile le TypeScript en JavaScript dans /build
# Cette étape est nécessaire car Node.js n'exécute que du JavaScript
RUN npm run build

# === ÉTAPE 7 : Exposer le port ===
# EXPOSE est purement documentaire : ça indique sur quel port l'app écoute
# Ici, 3001 correspond au PORT=3001 défini dans ton .env
# Cela ne rend PAS le port accessible ! C'est Docker Compose qui fera le mapping
EXPOSE 3001

# === ÉTAPE 8 : Commande de démarrage du conteneur ===
# CMD = commande exécutée quand le conteneur DÉMARRE (pas pendant le build)
# Format tableau : ["commande", "arg1", "arg2"]
# Ici : "npm start" lance "node build/index.js" (version production compilée)
CMD ["npm", "start"]
