"use client";

import Link from "next/link";
import { useState } from "react";

interface Article {
  title: string;
  head: string;
  published_at: string;
  sub_title: string;
  category: string;
  article_lead: string;
}

export default function CategoryPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  const categories = [
    "International",
    "Actualités locales",
    "Économie",
    "Sciences et technologies",
    "Divertissement",
    "Sports",
    "Santé",
  ];

  //   {
  //     title: "Les dernières innovations technologiques en 2024",
  //     head: "Le monde de la technologie continue d'évoluer à un rythme effréné. Cette année, nous avons assisté à des innovations remarquables dans plusieurs domaines.",
  //     published_at: "2024-01-15T10:30:00Z",
  //     category: "un",
  //     sub_title:"subtitle",
  //     article_lead: "article_lead"
  //   }, {
  //     title: "Les dernières innovations technologiques en 2024",
  //     head: "Le monde de la technologie continue d'évoluer à un rythme effréné. Cette année, nous avons assisté à des innovations remarquables dans plusieurs domaines.",
  //     published_at: "2024-01-15T10:30:00Z",
  //     category: "un",
  //     sub_title:"subtitle",
  //     article_lead: "article_lead"
  //   }, {
  //     title: "Les dernières innovations technologiques en 2024",
  //     head: "Le monde de la technologie continue d'évoluer à un rythme effréné. Cette année, nous avons assisté à des innovations remarquables dans plusieurs domaines.",
  //     published_at: "2024-01-15T10:30:00Z",
  //     category: "un",
  //     sub_title:"subtitle",
  //     article_lead: "article_lead"
  //   }, {
  //     title: "Les dernières innovations technologiques en 2024",
  //     head: "Le monde de la technologie continue d'évoluer à un rythme effréné. Cette année, nous avons assisté à des innovations remarquables dans plusieurs domaines.",
  //     published_at: "2024-01-15T10:30:00Z",
  //     category: "un",
  //     sub_title:"subtitle",
  //     article_lead: "article_lead"
  //   }, {
  //     title: "Les dernières innovations technologiques en 2024",
  //     head: "Le monde de la technologie continue d'évoluer à un rythme effréné. Cette année, nous avons assisté à des innovations remarquables dans plusieurs domaines.",
  //     published_at: "2024-01-15T10:30:00Z",
  //     category: "un",
  //     sub_title:"subtitle",
  //     article_lead: "article_lead"
  //   }
  // ];

  const articlesOfCategory = async (category: string) => {
    try {
      const res = await fetch(
        `http://localhost:8002/api/articles/category/${encodeURIComponent(category)}`,
      );

      const data = await res.json();
      console.log(data);
      setArticles(data);
    } catch (err) {
      console.error("Erreur:", err);
      setArticles([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="text-black font-bold mb-6 text-center">
        Choix par Catégories
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {categories.map((category, index) => (
          <button
            key={`${category}-${index}`}
            onClick={() => articlesOfCategory(category)}
            className="text-black border-gray-200 border-2 p-4 rounded-lg bg-white shadow-sm hover:bg-gray-400 hover:text-white cursor-pointer"
          >
            {category}
          </button>
        ))}
      </div>
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
    </div>
  );
}
