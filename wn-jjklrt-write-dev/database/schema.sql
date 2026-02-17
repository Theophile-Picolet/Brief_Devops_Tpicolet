-- Active: 1763121824020@@localhost@5432@db_writer

-- création du schéma WRITER
CREATE SCHEMA IF NOT EXISTS writer;

-- création de la table articles dans le schéma writer
CREATE TABLE IF NOT EXISTS writer.articles (
    title VARCHAR(300) NOT NULL,
    sub_title VARCHAR(300) NOT NULL,
    article_lead VARCHAR(1000) NOT NULL,
    body VARCHAR(10000) NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT articles_categorie_check
    CHECK (
        categorie IN (
            'International',
            'Actualités locales',
            'Économie',
            'Sciences et technologies',
            'Divertissement',
            'Sports',
            'Santé'
        )
    ),
    PRIMARY KEY (title, published_at)
);

-- fonction appelée par le trigger pour rafraîchir la vue matérialisée lecteur.articles_lecture
-- vérifie l'existence de la vue avant de la rafraîchir pour éviter les erreurs.
CREATE OR REPLACE FUNCTION writer.refresh_reader_view()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        -- lister les vues matérialisées existantes dont le schemaname est égale à "reader".
        SELECT 1 FROM pg_matviews WHERE schemaname = 'reader' AND matviewname = 'articles_lecture'
    ) THEN
        -- Vérifier si l'index unique existe pour utiliser CONCURRENTLY
        IF EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE schemaname = 'reader' 
            AND tablename = 'articles_lecture' 
            AND indexdef LIKE '%UNIQUE%'
        ) THEN
            REFRESH MATERIALIZED VIEW CONCURRENTLY reader.articles_lecture;
            RAISE NOTICE 'Vue matérialisée rafraîchie (concurrent)';
        ELSE
            REFRESH MATERIALIZED VIEW reader.articles_lecture;
            RAISE NOTICE 'Vue matérialisée rafraîchie (non-concurrent, index manquant)';
        END IF;
    ELSE
        RAISE NOTICE 'Vue reader.articles_lecture non trouvée (équipe reader pas encore passée)';
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
-- plpgsql est le langage de programmation utilisé pour écrire une fonction.

-- trigger qui s'active après INSERT/UPDATE/DELETE sur writer.articles
-- exécute refresh_reader_view() pour maintenir la vue matérialisée à jour.

-- DROP TRIGGER IF EXISTS articles_changed ON writer.articles;

CREATE TRIGGER articles_changed
    AFTER INSERT OR UPDATE OR DELETE
    ON writer.articles
    FOR EACH STATEMENT
    EXECUTE FUNCTION writer.refresh_reader_view();

-- commentaires pour la documentation
COMMENT ON SCHEMA writer IS 'Schéma contenant les tables du côté Writer (journalistes)';
COMMENT ON TABLE writer.articles IS 'Table principale des articles créés par les journalistes';
COMMENT ON TRIGGER articles_changed ON writer.articles IS 'Rafraîchit automatiquement la vue matérialisée lecteur.articles_lecture à chaque modification (si elle existe)';
