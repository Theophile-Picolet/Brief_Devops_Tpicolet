-- DROP MATERIALIZED VIEW IF EXISTS lecteur.articles_lecture;
CREATE SCHEMA IF NOT EXISTS reader;

CREATE MATERIALIZED VIEW reader.articles_lecture AS
SELECT *
FROM writer.articles
WHERE deleted_at IS NULL
ORDER BY published_at DESC;

-- Créer un index unique sur la vue matérialisée pour permettre le rafraîchissement concurrent
CREATE UNIQUE INDEX articles_lecture_pk ON reader.articles_lecture (title, published_at);

-- Rafraîchir la vue après création
REFRESH MATERIALIZED VIEW reader.articles_lecture;
