"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Article {
  title: string;
  sub_title?: string;
  article_lead: string;
  body: string;
  published_at: string;
  category: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("http://localhost:8002/api/articles");
        if (!res) {
          setArticles([]);
          setLoading(false);
          console.info("Erreur lors du chargement des articles");
          return;
        }
        const data = await res.json();
        console.log("data => ", data);
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur lors du chargement des articles:", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

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
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 font-share">
            Articles
          </h1>
          <p className="text-sm sm:text-base text-black mb-4 sm:mb-6 md:mb-8 font-puritan">
            10 dernières ajout
          </p>
          <p className="text-black font-puritan">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2 sm:mb-3 font-share">
          World News
        </h1>
        <p className="text-sm sm:text-base text-black mb-6 sm:mb-8 font-share">
          10 dernières articles
        </p>
        {articles.length === 0 ? (
          <p className="text-black font-puritan">Aucun article disponible.</p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {articles.map((article) => (
              <Link
                key={article.title}
                href={`/articles/${encodeURIComponent(article.title)}`}
                className="block"
              >
                <article className="bg-blue-50 border border-gray-300 hover:border-gray-400 transition-colors">
                  <div className="p-5 sm:p-6 md:p-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2 sm:mb-3 font-share leading-tight">
                      {article.title}
                    </h2>
                    {article.sub_title && (
                      <h3 className="text-base sm:text-lg text-gray-700 font-puritan mb-2">
                        {article.sub_title}
                      </h3>
                    )}
                    <div className="flex items-center gap-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600 font-puritan uppercase tracking-wide">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-black line-clamp-3 font-puritan leading-relaxed">
                      {article.article_lead}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-black line-clamp-3 font-puritan leading-relaxed">
                      {article.category}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
