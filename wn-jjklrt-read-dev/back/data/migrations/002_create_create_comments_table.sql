CREATE TABLE reader.comments (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  article_title TEXT NOT NULL,
  article_published_at TIMESTAMP NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) <= 1000),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (article_title, article_published_at) REFERENCES writer.articles(title, published_at)
);

-- Créer la vue matérialisée des commentaires
CREATE MATERIALIZED VIEW reader.commentaires_lecture AS
SELECT *
FROM reader.comments
ORDER BY created_at DESC;

-- Rafraîchir la vue après création
REFRESH MATERIALIZED VIEW reader.commentaires_lecture;

-- DROP TABLE comments;  
-- DROP MATERIALIZED VIEW IF EXISTS reader.commentaires_lecture;  