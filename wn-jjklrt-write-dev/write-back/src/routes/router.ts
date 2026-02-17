import express from "express";
const router = express.Router();

//importer les controllers et les middlewares//
import Article from "../controllers/article-controller";
import { validateArticle } from "../middlewares/formArticle";

//méthodes http//

//CREATE//
router.post("/api/articles", validateArticle, Article.add);

// READ ALL//
router.get("/api/articles", Article.browse);

// READ one article by title/
router.get("/api/articles/:title", Article.readByTitle);

// UPDATE article //
router.put("/api/articles/:title", validateArticle, Article.update);

// SOFT-DELETE article //
router.delete("/api/articles/:title/soft-delete", Article.softDelete); 
// -> Ordre des routes est important ici ! la route la plus spécifique (softDelete) doit être définie avant la route plus générale (destroy)

// DELETE article //
router.delete("/api/articles/:title", Article.destroy);

export default router;