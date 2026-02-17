import type { RequestHandler } from "express";
import CommentRepository from "../service/comment-service";

//BREAD//

//----------------------------------------------------------------------------------//
// browse du bread //
const browse: RequestHandler = async (req, res, next) => {
  try {
    const articleTitle = req.params.title;
    const comments =
      await CommentRepository.getCommentsByArticleTitle(articleTitle);
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

// add du bread //
const addComment: RequestHandler = async (req, res, next) => {
  const articleTitle = req.params.title;
  const { description } = req.body;
  if (!description || description.length > 1000) {
    return res
      .status(400)
      .json({ error: "Description obligatoire et max 1000 caractères" });
  }
  try {
    // Récupère l'article pour obtenir published_at
    const article = await CommentRepository.getArticleByTitle(articleTitle);
    
    if (!article) {
      return res.status(404).json({ error: "Article non trouvé" });
    }

    const newComment = await CommentRepository.addComment(
      articleTitle,
      article.published_at,
      description,
    );
    res.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  addComment,
};