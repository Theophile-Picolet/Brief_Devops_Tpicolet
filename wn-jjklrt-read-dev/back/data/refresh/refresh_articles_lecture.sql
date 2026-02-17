-- Script de rafraîchissement de la vue matérialisée articles_lecture dans le schéma reader

REFRESH MATERIALIZED VIEW reader.articles_lecture;

-- Note : ce script est à part car le refresh n’est pas une migration.
-- il peut être appelé :
    -- manuellement
    -- par un cron
    -- par l’équipe Journaliste
    -- par un script CI/CD