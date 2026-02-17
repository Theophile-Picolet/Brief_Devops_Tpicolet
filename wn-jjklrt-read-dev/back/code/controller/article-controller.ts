import type { RequestHandler } from "express";
import ArticleRepository from "../service/article-service";

//BREAD//

//----------------------------------------------------------------------------------//
// browse du bread //
const browse: RequestHandler = async (req, res, next) => {
  try {
    const articles = await ArticleRepository.read();
    res.status(200).json(articles);
  }
  catch (err) {
    next(err);
  }
}

// read du bread //
const readByTitle: RequestHandler = async (req, res, next) => {
  const title = req.params.title;
  try {
    const article = await ArticleRepository.readByTitle(title);
    if (!article) {
      res.status(404).json({ message: "aucun article correspond" });
      return;
    }
    res.status(200).json(article);
  }
  catch (err) {
    next(err);
  }
}

const readByCategory: RequestHandler = async (req, res, next) => {
  const category = req.params.category;
  try {
    const article = await ArticleRepository.readByCategory(category);
    if (!article) {
      res.status(404).json({ message: "aucun article correspond" });
      return;
    }
    res.status(200).json(article);
  }
  catch (err) {
    next(err);
  }
}



export default {
  browse,
  readByTitle,
  readByCategory
}
