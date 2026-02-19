import type { Request, RequestHandler, Response } from "express";
import FavoriteRepository from "../service/favorite-service";

const COOKIE_NAME = "reader_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function readCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function resolveReaderId(req: Request, res: Response): Promise<number> {
  const rawId = readCookieValue(req.headers.cookie, COOKIE_NAME);
  const parsedId = rawId ? Number.parseInt(rawId, 10) : NaN;
  const readerId = await FavoriteRepository.ensureReader(
    Number.isFinite(parsedId) ? parsedId : undefined,
  );

  if (!rawId || readerId !== parsedId) {
    res.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=${readerId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
    );
  }

  return readerId;
}
//BREAD//

//----------------------------------------------------------------------------------//
// read du bread //
const readStatus: RequestHandler = async (req, res, next) => {
  try {
    const readerId = await resolveReaderId(req, res);
    res.status(200).json({
      is_favorite: await FavoriteRepository.isFavorite(
        readerId,
        req.params.title,
      ),
    });
  } catch (err) {
    next(err);
  }
};

// add du bread //
const addFavorite: RequestHandler = async (req, res, next) => {
  try {
    const readerId = await resolveReaderId(req, res);
    const articleExists = await FavoriteRepository.addFavorite(
      readerId,
      req.params.title,
    );

    if (!articleExists) {
      res.status(404).json({ message: "Article introuvable" });
      return;
    }
    res.status(200).json({ is_favorite: true });
  } catch (err) {
    next(err);
  }
};

// delete du bread //
const removeFavorite: RequestHandler = async (req, res, next) => {
  try {
    const readerId = await resolveReaderId(req, res);
    await FavoriteRepository.removeFavorite(readerId, req.params.title);
    res.status(200).json({ is_favorite: false });
  } catch (err) {
    next(err);
  }
};

export default {
  readStatus,
  addFavorite,
  removeFavorite,
};
