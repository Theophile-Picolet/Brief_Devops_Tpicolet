import express from "express";

const router = express.Router();

//importer les controllers et les middlewares//
import Article from "../controllers/article-controller";
import { validateArticle } from "../middlewares/formArticle";

//méthodes http//

//CREATE//
router.post("/articles", validateArticle, Article.add);

// READ ALL//
router.get("/articles", Article.browse);

// READ one article by title/
router.get("/articles/:title", Article.readByTitle);

// UPDATE article //
router.put("/articles/:title", validateArticle, Article.update);

// SOFT-DELETE article //
router.delete("/articles/:title/soft-delete", Article.softDelete);
// -> Ordre des routes est important ici ! la route la plus spécifique (softDelete) doit être définie avant la route plus générale (destroy)

// DELETE article //
router.delete("/articles/:title", Article.destroy);

export default router;
