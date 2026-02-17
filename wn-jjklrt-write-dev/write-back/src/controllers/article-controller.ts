import type { RequestHandler } from "express";
import ArticleRepository from "../services/article-service";

//BREAD//

//----------------------------------------------------------------------------------//
// browse du bread //
const browse: RequestHandler = async (req, res, next)=> {
  try {
    const articles = await ArticleRepository.read();
    res.status(200).json(articles);
  }
  catch (err) {
    next(err);
  }
}

// read du bread //
const readByTitle: RequestHandler = async (req, res, next)=> {
  const title = req.params.title;
  try {
    const article = await ArticleRepository.readByTitle(title);
    if(!article){
      res.status(404).json({ message: "aucun article correspond" });
      return;
    }
    res.status(200).json(article);
  } 
  catch (err) {
    next(err);
  }
}

// edit du bread //
const update: RequestHandler = async (req, res, next) => {
  const currentTitle = req.params.title;
  try {
    const article = await ArticleRepository.readByTitle(currentTitle);
    if (!article) {
      res.status(404).json({ message: "Aucun article trouvé avec ce titre" });
      return;
    }
    const updated = await ArticleRepository.update(currentTitle, {
      title: req.body.title,
      sub_title: req.body.sub_title,
      article_lead: req.body.article_lead,
      body: req.body.body,
      categorie: req.body.categorie,
    });

    if (!updated) {
      res.status(404).json({ message: "Aucune donnée mise à jour" });
      return;
    }
    res.status(200).json({ "nombre de champs mis à jour": updated });
  } catch (err) {
    next(err);
  }
};

// add du bread //
const add: RequestHandler = async (req, res, next)=> {
  try {
    const article ={
      title: req.body.title,
      sub_title: req.body.sub_title,
      article_lead: req.body.article_lead,
      body: req.body.body,
      categorie: req.body.categorie,
      published_at: req.body.published_at
    }
    const articleTitle = await ArticleRepository.create(article);
    res.status(201).json({ title: articleTitle });
  }
  catch (err) {
    next(err);
  }
};

// delete du bread //
const destroy: RequestHandler = async (req, res, next)=> {
  const title = req.params.title;
  try {
    const article = await ArticleRepository.readByTitle(title);
    if (!article) {
      res.status(404).json({ message: "aucun article trouvé" });
      return;
    }
    const deleted = await ArticleRepository.delete(title);
    if (!deleted) {
      res.status(404).json({ message: "aucun article supprimé" });
      return;
    }
    if (deleted) {
      res.status(200).json({ message: "article supprimé avec succes" });
    }
  } catch (err) {
    next(err);
  }
};

// soft-delete du bread //
const softDelete: RequestHandler = async (req, res, next) => {
  const title = req.params.title;
  try {
    const deleted = await ArticleRepository.softDelete(title);
    if(!deleted) {
      res.status(404).json({ message : "Aucun article supprimé ou déjà supprimé"});
      return;
    }
    res.status(200).json({ message: "article mis de coté avec succes" });
  } catch (err) {
    next(err);
  }
}

export default {
  add,
  browse,
  readByTitle,
  update,
  destroy, // hard-delete (optionnel)
  softDelete, // soft-delete (suppression logique)
}
