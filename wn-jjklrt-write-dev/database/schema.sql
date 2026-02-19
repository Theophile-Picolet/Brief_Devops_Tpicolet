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

-- Données de test pour les tests d'intégration (5 articles)
INSERT INTO writer.articles (title, sub_title, article_lead, body, categorie, published_at, deleted_at) VALUES
    ('decouverte-d-une-exoplanete', 'Une nouvelle planète hors du système solaire', 'Des astronomes ont identifié une exoplanète potentiellement habitable.', 'Le télescope spatial James Webb a permis la découverte d''une exoplanète située à 120 années-lumière de la Terre. Les premières analyses révèlent une atmosphère riche en vapeur d''eau.', 'Sciences et technologies', '2024-04-01 10:00:00', NULL),
    ('croissance-economique-record', 'Le PIB en forte hausse', 'L''économie française enregistre une croissance inédite ce trimestre.', 'Selon l''INSEE, le PIB a progressé de 3,2% au premier trimestre 2024, porté par la reprise du secteur industriel et des exportations.', 'Économie', '2024-04-02 09:30:00', NULL),
    ('nouvelles-mesures-sanitaires', 'Le gouvernement annonce des restrictions', 'Face à la recrudescence des cas, de nouvelles mesures sont prises.', 'Le ministère de la Santé impose le port du masque dans les lieux publics fermés et encourage la vaccination pour limiter la propagation du virus.', 'Santé', '2024-04-03 08:45:00', NULL),
    ('victoire-historique-en-football', 'L''équipe locale remporte le championnat', 'Un match intense s''est soldé par la victoire de l''équipe de Lyon.', 'Après une saison exceptionnelle, l''Olympique Lyonnais décroche le titre de champion de France lors d''une finale haletante.', 'Sports', '2024-04-04 20:00:00', NULL),
    ('festival-du-film-de-cannes', 'Des stars sur le tapis rouge', 'La 77e édition du festival attire les plus grands noms du cinéma.', 'Le festival de Cannes 2024 s''ouvre avec une sélection de films internationaux et la présence de réalisateurs et acteurs de renom.', 'Divertissement', '2024-04-05 18:00:00', NULL);
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
