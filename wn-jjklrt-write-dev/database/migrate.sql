-- copie les articles de l'ancienne table vers la nouvelle.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'writer' AND table_name = 'articles'
    ) THEN
        RAISE EXCEPTION 'Table writer.articles inexistante. Exécutez schema.sql d''abord.';
    END IF;
END $$;

INSERT INTO writer.articles (title, sub_title, article_lead, body, categorie, published_at)
SELECT title, sub_title, article_lead, body, categorie, published_at
FROM public.articles
ON CONFLICT (title) DO NOTHING;

-- Suppression de l'ancienne table public.articles après migration réussie

