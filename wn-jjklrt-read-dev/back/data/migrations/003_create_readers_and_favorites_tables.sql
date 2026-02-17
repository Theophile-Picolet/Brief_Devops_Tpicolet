CREATE SCHEMA IF NOT EXISTS reader;

CREATE TABLE IF NOT EXISTS reader.readers (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reader.favorites (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reader_id INTEGER NOT NULL REFERENCES reader.readers(id) ON DELETE CASCADE,
  article_title TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (reader_id, article_title)
);

CREATE INDEX IF NOT EXISTS favorites_reader_id_idx
  ON reader.favorites (reader_id);

CREATE INDEX IF NOT EXISTS favorites_article_title_idx
  ON reader.favorites (article_title);