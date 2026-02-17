import express from "express";
import article from "../controller/article-controller";
import comment from "../controller/comment-controller";
import favorite from "../controller/favorite-controller";

const router = express.Router();

router.get("/api/articles", article.browse);
router.get("/api/articles/category/:category", article.readByCategory);
router.get("/api/articles/:title", article.readByTitle);
//----------------------------------------------------------------------------------//
router.get("/api/articles/:title/comments", comment.browse);
router.post("/api/articles/:title/comments", comment.addComment);
router.get("/api/articles/:title/favorite", favorite.readStatus);
router.post("/api/articles/:title/favorite", favorite.addFavorite);
router.delete("/api/articles/:title/favorite", favorite.removeFavorite);

export default router;
