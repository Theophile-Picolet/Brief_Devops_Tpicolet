import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

import request from "supertest";
import client from "../config/client";
import app from "../index";

describe("GET /api/articles", () => {
  it("doit retourner 200 et un tableau", async () => {
    const response = await request(app).get("/api/articles");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("POST /api/articles", () => {
  it("doit créer un nouvel article et retourner 201", async () => {
    const newArticle = {
      title: "Test API Article",
      sub_title: "Sous-titre test",
      article_lead: "Lead test",
      body: "Contenu de l'article de test.",
      categorie: "Sciences et technologies",
    };
    const response = await request(app)
      .post("/api/articles")
      .send(newArticle)
      .set("Accept", "application/json");
    expect([200, 201]).toContain(response.status);
    expect(response.body).toHaveProperty("title", newArticle.title);
  });
});

describe("GET /api/articles/:title", () => {
  it("doit retourner l'article demandé avec 200", async () => {
    const response = await request(app).get(
      "/api/articles/Test%20API%20Article",
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Test API Article");
  });
  it("retourne 404 si l'article n'existe pas", async () => {
    const response = await request(app).get("/api/articles/inexistant-xyz");
    expect(response.status).toBe(404);
  });
});

describe("DELETE /api/articles/:title", () => {
  it("doit supprimer l'article et retourner 200 ou 204", async () => {
    const response = await request(app).delete(
      "/api/articles/Test%20API%20Article",
    );
    expect([200, 204]).toContain(response.status);
  });
  it("retourne 404 si l'article à supprimer n'existe pas", async () => {
    const response = await request(app).delete("/api/articles/inexistant-xyz");
    expect(response.status).toBe(404);
  });
});

afterAll(async () => {
  await client.end();
});
