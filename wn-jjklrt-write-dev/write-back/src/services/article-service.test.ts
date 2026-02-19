import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

import { jest } from "@jest/globals";
import Pg from "../config/client";
import ArticleRepository from "./article-service";

describe("ArticleRepository", () => {
  describe("readByTitle", () => {
    it("retourne l'article si trouvé", async () => {
      // Faux article simulé
      const fakeArticle = {
        title: "Fake Title",
        sub_title: "Fake Subtitle",
        article_lead: "Fake lead",
        body: "Fake body",
        categorie: "Fake category",
        published_at: new Date("2023-01-01T00:00:00Z"),
      };
      // Mock de Pg.query pour retourner le faux article
      jest.spyOn(Pg, "query").mockResolvedValueOnce({ rows: [fakeArticle] });

      const result = await ArticleRepository.readByTitle("Fake Title");
      expect(result).toEqual(fakeArticle);
    });
  });

  describe("delete", () => {
    it("retourne le nombre de lignes supprimées", async () => {
      jest.spyOn(Pg, "query").mockResolvedValueOnce({ rowCount: 1 });
      const result = await ArticleRepository.delete("Fake Title");
      expect(result).toBe(1);
    });
  });

  describe("read", () => {
    it("retourne la liste des articles", async () => {
      const fakeArticles = [
        {
          title: "A",
          sub_title: "",
          article_lead: "",
          body: "",
          categorie: "",
          published_at: new Date(),
        },
        {
          title: "B",
          sub_title: "",
          article_lead: "",
          body: "",
          categorie: "",
          published_at: new Date(),
        },
      ];
      jest.spyOn(Pg, "query").mockResolvedValueOnce({ rows: fakeArticles });
      const result = await ArticleRepository.read();
      expect(result).toEqual(fakeArticles);
    });
  });
});

afterAll(async () => {
  await Pg.end();
});
