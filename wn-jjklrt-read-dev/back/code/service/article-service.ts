import { pool } from "../database/db";

interface Article {

  title: string,
  sub_title: string,
  article_lead: string,
  body: string,
  published_at: Date,
  category?: string,
}

class ArticleRepository {
  // read du crud //
  async read(): Promise<Article[]> {
    const result = await pool.query<Article>(
      "SELECT * FROM reader.articles_lecture ORDER BY published_at DESC",
    );
    return result.rows;
  }

  // readByTitle du crud //
  async readByTitle(title: string): Promise<Article | null> {
    const result = await pool.query<Article>(
      "SELECT * FROM reader.articles_lecture WHERE title = $1",
      [title],
    );
    return result.rows[0];
  }

  // readByCategory du crud //
  async readByCategory(category: string): Promise<Article[] | null> {
    const result = await pool.query<Article>("SELECT * FROM reader.articles_lecture WHERE categorie = $1", [category]);
    return result.rows;
  }
}

export default new ArticleRepository();
