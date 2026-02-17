import { pool } from "../database/db";

class FavoriteRepository {
  async ensureReader(readerId?: number): Promise<number> {
    if (readerId) {
      const existing = await pool.query<{ id: number }>(
        "SELECT id FROM reader.readers WHERE id = $1",
        [readerId],
      );
      if (existing.rows[0]) {
        return readerId;
      }
    }

    const result = await pool.query<{ id: number }>(
      "INSERT INTO reader.readers DEFAULT VALUES RETURNING id",
    );
    return result.rows[0].id;
  }

  async isFavorite(readerId: number, articleTitle: string): Promise<boolean> {
    const result = await pool.query(
      `SELECT 1
       FROM reader.favorites f
       JOIN reader.articles_lecture a ON a.title = f.article_title
       WHERE f.reader_id = $1 AND f.article_title = $2
       LIMIT 1`,
      [readerId, articleTitle],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async addFavorite(readerId: number, articleTitle: string): Promise<boolean> {
    const result = await pool.query<{ article_exists: boolean }>(
      `WITH article AS (
         SELECT title FROM reader.articles_lecture WHERE title = $2
       ),
       inserted AS (
         INSERT INTO reader.favorites (reader_id, article_title)
         SELECT $1, title FROM article
         ON CONFLICT (reader_id, article_title) DO NOTHING
       )
       SELECT EXISTS (SELECT 1 FROM article) AS article_exists`,
      [readerId, articleTitle],
    );
    return result.rows[0]?.article_exists ?? false;
  }

  async removeFavorite(readerId: number, articleTitle: string): Promise<void> {
    await pool.query(
      "DELETE FROM reader.favorites WHERE reader_id = $1 AND article_title = $2",
      [readerId, articleTitle],
    );
  }
}

export default new FavoriteRepository();
