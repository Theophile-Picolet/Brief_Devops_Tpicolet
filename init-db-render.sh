#!/bin/bash
# Script d'initialisation de la base de données PostgreSQL pour Render
# À exécuter après avoir créé la base de données sur Render

set -e  # Arrête le script en cas d'erreur

echo "🚀 Initialisation de la base de données PostgreSQL..."

# Vérifier que les variables d'environnement sont définies
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Erreur: La variable DATABASE_URL n'est pas définie"
  echo "Utilisez: export DATABASE_URL=<votre_url_depuis_render>"
  exit 1
fi

echo "📋 Étape 1/3 : Exécution du schéma Writer (tables)"
psql $DATABASE_URL -f wn-jjklrt-write-dev/database/schema.sql

echo "📋 Étape 2/3 : Exécution des migrations Reader (vues, triggers)"
for file in wn-jjklrt-read-dev/back/data/migrations/*.sql; do
  if [ -f "$file" ]; then
    echo "  - Exécution de $(basename $file)"
    psql $DATABASE_URL -f "$file"
  fi
done

echo "📋 Étape 3/3 : Vérification des tables créées"
psql $DATABASE_URL -c "\dt"

echo "✅ Initialisation terminée avec succès!"
echo ""
echo "Tables Writer créées:"
echo "  - articles"
echo "  - categories"
echo "  - tags"
echo "  - images"
echo "  - article_tags"
echo ""
echo "Tables/Vues Reader créées:"
echo "  - articles_lecture (vue)"
echo "  - comments"
echo "  - readers"
echo "  - favorites"
