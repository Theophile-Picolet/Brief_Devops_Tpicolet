// import { Request, Response, NextFunction } from "express";
// import { getAllArticles as getAllArticlesService, getArticleById as getArticleByIdService } from "../service/articleService";

// export async function getAllArticles(
//     req: Request,
//     res: Response,
//     next: NextFunction,
// ) {
//     try {
//         // les query params
//         const recent = req.query.recent === "true";
//         const limitParam = req.query.limit as string;

//         // Validation du paramètre limit
//         let limit: number | undefined;
//         if (limitParam) {
//             limit = parseInt(limitParam);
//             if (isNaN(limit) || limit <= 0) {
//                 return res
//                     .status(400)
//                     .json({ error: "Le paramètre 'limit' doit être un nombre positif" });
//             }
//         }

//         const articles = await getAllArticlesService(recent, limit);

//         // Vérifier si aucun article n'est disponible
//         if (articles.length === 0) {
//             return res.status(404).json({ error: "Aucun article disponible" });
//         }

//         res.json(articles);
//     } catch (error) {
//         next(error);
//     }
// }

// export async function getArticleById(
//     req: Request,
//     res: Response,
//     next: NextFunction,
// ) {
//     try {
//         const id = parseInt(req.params.id);

//         // Validation de l'ID
//         if (isNaN(id) || id <= 0) {
//             return res
//                 .status(400)
//                 .json({ error: "L'ID doit être un nombre positif valide" });
//         }

//         const article = await getArticleByIdService(id);

//         // Vérifier si l'article existe
//         if (!article) {
//             return res.status(404).json({ error: "Article non trouvé" });
//         }

//         res.json(article);
//     } catch (error) {
//         next(error);
//     }
// }
