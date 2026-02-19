"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddCommentButton from "@/app/component/ui/AddCommentButton";
import BackButton from "@/app/component/ui/BackButton";
import CommentsClient from "@/app/component/ui/CommentsClient";

interface Article {
  title: string;
  sub_title?: string;
  head: string;
  body?: string;
  published_at: string;
}

export default function ArticleDetailPage() {
  // const router = useRouter(); non pas ça
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(true);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  const params = useParams();
  const articleTitle = params.details as string;
  const articlesBaseUrl = "http://localhost:8002/api/articles";
  const encodedTitle = articleTitle ? encodeURIComponent(articleTitle) : "";
  const articleUrl = encodedTitle ? `${articlesBaseUrl}/${encodedTitle}` : "";
  const favoriteUrl = articleUrl ? `${articleUrl}/favorite` : "";

  useEffect(() => {
    if (!articleTitle) {
      console.error("Le titre doit être défini");
      setLoading(false);
      return;
    }

    // Essayer d'abord la route getArticleById
    fetch(articleUrl)
      .then((res) => {
        if (res.ok) {
          console.info(res);
          return res.json();
        }
        // Si la route n'existe pas, récupérer tous les articles et filtrer
        return fetch(articlesBaseUrl)
          .then((res) => res.json())
          .then((data) => {
            const foundArticle = data.find(
              (art: Article) => art.title === articleTitle,
            );
            if (!foundArticle) {
              throw new Error("Article non trouvé");
            }
            return foundArticle;
          });
      })
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement de l'article:", err);
        setLoading(false);
      });
  }, [articleTitle, articleUrl]);

  useEffect(() => {
    if (!favoriteUrl) {
      setFavoriteLoading(false);
      return;
    }

    setFavoriteLoading(true);
    setFavoriteError(null);
    fetch(favoriteUrl, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            return { is_favorite: false };
          }
          throw new Error("Erreur lors de la récupération du favori");
        }
        return res.json();
      })
      .then((data) => {
        setIsFavorite(Boolean(data?.is_favorite));
      })
      .catch((err) => {
        console.error("Erreur lors du chargement du favori:", err);
        setFavoriteError("Impossible de charger le statut favori.");
        setIsFavorite(false);
      })
      .finally(() => {
        setFavoriteLoading(false);
      });
  }, [favoriteUrl]);

  const toggleFavorite = async () => {
    if (!favoriteUrl || favoriteLoading) {
      return;
    }

    setFavoriteLoading(true);
    setFavoriteError(null);
    try {
      const res = await fetch(favoriteUrl, {
        method: isFavorite ? "DELETE" : "POST",
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) {
          setFavoriteError("Cet article n'existe plus.");
          setIsFavorite(false);
          return;
        }
        throw new Error("Erreur lors de la mise à jour du favori");
      }

      const data = await res.json();
      setIsFavorite(Boolean(data?.is_favorite));
    } catch (err) {
      console.error("Erreur lors de la mise à jour du favori:", err);
      setFavoriteError("Impossible de mettre à jour le favori.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-white p-8 text-center">
            <p className="text-black font-puritan">
              Chargement de l&#39;article...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-white p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-black mb-4 font-share">
              Article non trouvé
            </h1>
            <BackButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-4xl px-4">
        <BackButton className="mb-6 sm:mb-8" />

        <article className="bg-white">
          {/* En-tête de l'article */}
          <div className="bg-white p-6 sm:p-8 pb-4 sm:pb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-2 sm:mb-3 font-share leading-tight">
              {article.title}
            </h1>
            {article.sub_title && (
              <h2 className="text-lg sm:text-xl md:text-2xl text-black mb-2 sm:mb-3 font-share">
                {article.sub_title}
              </h2>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base text-black font-puritan mb-4">
              <span>{formatDate(article.published_at)}</span>
              <button
                type="button"
                onClick={toggleFavorite}
                disabled={favoriteLoading}
                aria-pressed={isFavorite}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:text-sm font-puritan transition-colors ${
                  isFavorite
                    ? "border-[#5C6C73] bg-[#C2E0E3] text-[#253337]"
                    : "border-[#C2E0E3] text-[#253337] hover:bg-[#C2E0E3]/30"
                } ${favoriteLoading ? "cursor-not-allowed opacity-60" : ""}`}
              >
                {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              </button>
              {favoriteError && (
                <span className="text-xs sm:text-sm text-red-600">
                  {favoriteError}
                </span>
              )}
            </div>
          </div>

          {/* Contenu de l'article */}
          <div className="px-6 sm:px-8 md:px-10 pb-6 sm:pb-8 md:pb-10">
            {/* Chapeau */}
            {article.head && (
              <div className="mb-4 sm:mb-6">
                <p className="text-base sm:text-lg md:text-xl text-black leading-relaxed font-puritan">
                  {article.head}
                </p>
              </div>
            )}

            {/* Corps de l'article */}
            {article.body && (
              <div className="prose prose-lg max-w-none">
                <div className="text-sm sm:text-base md:text-lg text-black leading-relaxed whitespace-pre-wrap font-puritan">
                  {article.body}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Section commentaires */}
        <div className="px-6 sm:px-8 md:px-10 pb-6 sm:pb-8 md:pb-10">
          <div className="mt-8 bg-white text-black rounded shadow p-6">
            <AddCommentButton articleTitle={article.title} />
            <CommentsClient articleTitle={article.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
