import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

import request from "supertest";
import { pool } from "../database/db";
import app from "../index";

describe("Articles API - Reader Backend", () => {
  // Fermer la connexion à la base de données après tous les tests
  afterAll(async () => {
    await pool.end();
  });

  describe("GET /api/articles", () => {
    it("doit retourner 200 et un tableau d'articles", async () => {
      const res = await request(app).get("/api/articles");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      // Vérifie la structure d'un article
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty("title");
        expect(res.body[0]).toHaveProperty("sub_title");
        expect(res.body[0]).toHaveProperty("article_lead");
      }
    });
  });

  describe("GET /api/articles/:title", () => {
    it("doit retourner 200 et l'article demandé", async () => {
      // Test avec un article connu de la base de test
      const res = await request(app).get(
        "/api/articles/decouverte-d-une-exoplanete",
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title");
      expect(res.body.title).toBe("decouverte-d-une-exoplanete");
      expect(res.body).toHaveProperty("sub_title");
      expect(res.body).toHaveProperty("body");
      expect(res.body).toHaveProperty("categorie");
    });

    it("doit retourner 404 avec message d'erreur si l'article n'existe pas", async () => {
      const res = await request(app).get(
        "/api/articles/article-inexistant-xyz123",
      );
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("aucun article correspond");
    });
  });

  describe("GET /api/articles/category/:category", () => {
    it("doit retourner 200 et les articles de la catégorie demandée", async () => {
      const res = await request(app).get(
        "/api/articles/category/Sciences%20et%20technologies",
      );
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Si des articles existent, vérifier qu'ils appartiennent à la bonne catégorie
      if (res.body.length > 0) {
        res.body.forEach((article: { categorie: string }) => {
          expect(article.categorie).toBe("Sciences et technologies");
        });
      }
    });

    it("doit retourner 404 avec message d'erreur si aucun article dans cette catégorie", async () => {
      const res = await request(app).get(
        "/api/articles/category/CategorieInexistante",
      );
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("aucun article correspond");
    });
  });

  describe("GET /api/articles/:title/comments", () => {
    it("doit retourner 200 et un tableau de commentaires", async () => {
      const res = await request(app).get(
        "/api/articles/decouverte-d-une-exoplanete/comments",
      );
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Test de la structure si des commentaires existent
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty("description");
        expect(res.body[0]).toHaveProperty("article_title");
      }
    });
  });

  describe("POST /api/articles/:title/comments", () => {
    it("doit créer un commentaire et retourner 201", async () => {
      const newComment = {
        description: "Excellent article, très informatif !",
      };
      const res = await request(app)
        .post("/api/articles/decouverte-d-une-exoplanete/comments")
        .send(newComment)
        .set("Content-Type", "application/json");

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("description");
      expect(res.body.description).toBe(newComment.description);
      expect(res.body).toHaveProperty("article_title");
    });

    it("doit retourner 400 avec message d'erreur si description manquante", async () => {
      const res = await request(app)
        .post("/api/articles/decouverte-d-une-exoplanete/comments")
        .send({})
        .set("Content-Type", "application/json");

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe(
        "Description obligatoire et max 1000 caractères",
      );
    });

    it("doit retourner 400 avec message d'erreur si description trop longue", async () => {
      const longDescription = "a".repeat(1001);
      const res = await request(app)
        .post("/api/articles/decouverte-d-une-exoplanete/comments")
        .send({ description: longDescription })
        .set("Content-Type", "application/json");

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe(
        "Description obligatoire et max 1000 caractères",
      );
    });

    it("doit retourner 404 avec message d'erreur si l'article n'existe pas", async () => {
      const res = await request(app)
        .post("/api/articles/article-inexistant-xyz123/comments")
        .send({ description: "Un commentaire" })
        .set("Content-Type", "application/json");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Article non trouvé");
    });
  });
});
