import { pool } from "../database/db";

class CommentRepository {
  async getCommentsByArticleTitle(articleTitle: string) {
    const result = await pool.query(
      `SELECT id, description, created_at FROM reader.commentaires_lecture WHERE article_title = $1 ORDER BY created_at DESC`,
      [articleTitle],
    );
    return result.rows;
  }

  async addComment(
    articleTitle: string,
    articlePublishedAt: Date,
    description: string,
  ) {
    const result = await pool.query(
      `INSERT INTO reader.comments (article_title, article_published_at, description) VALUES ($1, $2, $3) RETURNING id, created_at`,
      [articleTitle, articlePublishedAt, description],
    );
    return result.rows[0];
  }

  async getArticleByTitle(articleTitle: string) {
    const result = await pool.query(
      `SELECT published_at FROM reader.articles_lecture WHERE title = $1 LIMIT 1`,
      [articleTitle],
    );
    return result.rows[0] || null;
  }
}

export default new CommentRepository();