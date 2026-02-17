#!/bin/bash
# Script d'initialisation pour exécuter les migrations reader dans l'ordre

set -e

echo "🔧 Exécution des migrations reader..."

# Exécuter chaque migration dans l'ordre
for migration in /docker-entrypoint-initdb.d/02-migrations/*.sql; do
    if [ -f "$migration" ]; then
        echo "  ▶ Exécution de $(basename "$migration")..."
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$migration"
        echo "  ✓ $(basename "$migration") terminée"
    fi
done

echo "✅ Toutes les migrations reader ont été appliquées avec succès"
