import { bool } from "joi";
import Pg from "../config/client";

interface Article {
  title: string,
  sub_title: string,
  article_lead: string,
  body: string,
  categorie: string,
  published_at: Date,
}

class ArticleRepository {
// create du crud //
  async create(article: Omit<Article, "published_at">): Promise<Article["title"]> {
    const result = await Pg.query<{ title: string }>(
      "INSERT INTO writer.articles (title, sub_title, article_lead, body, categorie) VALUES ($1, $2, $3, $4, $5) RETURNING title",
      [
        article.title,
        article.sub_title,
        article.article_lead,
        article.body,
        article.categorie,
      ]
    );
    return result.rows[0].title;
  }

// read du crud //
  async read(): Promise<Article[]> {
    const result = await Pg.query<Article>(
      // "SELECT * FROM writer.articles ORDER BY published_at DESC"
      "SELECT * FROM writer.articles WHERE deleted_at IS NULL ORDER BY published_at DESC" // exclure les articles soft-deleté
    );
    return result.rows;
  }

// readByTitle du crud //
  async readByTitle(title: string): Promise<Article | null> {
    const result = await Pg.query<Article>(
      // "SELECT * FROM writer.articles WHERE title = $1",
      "SELECT * FROM writer.articles WHERE title = $1 AND deleted_at IS NULL", // exclure les articles soft-deletés
      [title]
    );
    return result.rows[0];
  }

// update du crud //
  async update(currentTitle: string, data: Omit<Article, "published_at">): Promise<number | null> {
    const result = await Pg.query<Article>(
      "UPDATE writer.articles SET title = $1, sub_title = $2, article_lead = $3, body = $4, categorie = $5, published_at = NOW() WHERE title = $6 RETURNING *",
      [data.title, data.sub_title, data.article_lead, data.body, data.categorie, currentTitle],
    );
    return result.rowCount;
  }

// delete du crud //
  async delete(title: string): Promise<number | null> {
    const result = await Pg.query<Article>(
      "DELETE FROM writer.articles WHERE title = $1",
      [title]
    );
    return result.rowCount;
  }

// soft-delete du crud (suppression logique) //
  async softDelete(title: string): Promise<number | null> {
    const result = await Pg.query(
      "UPDATE writer.articles SET deleted_at = NOW() WHERE title = $1 AND deleted_at IS NULL",
      [title]
    );
    return result.rowCount;
  }
}

export default new ArticleRepository();

