import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const articleSchema = Joi.object({
  title: Joi.string()
    .max(300)
    .required()
    .messages({
      'string.base': 'Le titre doit être une chaîne de caractères.',
      'string.empty': 'Le titre est obligatoire.',
      'string.max': 'Le titre ne doit pas dépasser 300 caractères.',
      'any.required': 'Le titre est obligatoire.'
    }),
  sub_title: Joi.string()
    .max(300)
    .required()
    .messages({
      'string.base': 'Le sous-titre doit être une chaîne de caractères.',
      'string.empty': 'Le sous-titre est obligatoire.',
      'string.max': 'Le sous-titre ne doit pas dépasser 300 caractères.',
      'any.required': 'Le sous-titre est obligatoire.'
    }),
  article_lead: Joi.string()
    .max(1000)
    .required()
    .messages({
      'string.base': 'Le chapeau doit être une chaîne de caractères.',
      'string.empty': 'Le chapeau est obligatoire.',
      'string.max': 'Le chapeau ne doit pas dépasser 1000 caractères.',
      'any.required': 'Le chapeau est obligatoire.'
    }),
  body: Joi.string()
    .max(10000)
    .required()
    .messages({
      'string.base': 'Le corps doit être une chaîne de caractères.',
      'string.empty': 'Le corps de l\'article est obligatoire.',
      'string.max': 'Le corps ne doit pas dépasser 10 000 caractères.',
      'any.required': 'Le corps de l\'article est obligatoire.'
    })
});

export function validateArticle(req: Request, res: Response, next: NextFunction) {
  const { error } = articleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(detail => detail.message);
    console.log('Validation errors:', messages);
    return res.status(400).json({ errors: messages });
  }
  next();
}
