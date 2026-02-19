"use client";
import { useEffect, useState } from "react";
import Card from "@/components/articles/card";
import styles from "./articles.module.css";

type Article = {
  title: string;
  sub_title: string;
  article_lead: string;
  body: string;
  categorie: string;
  published_at: string;
};

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    const fetchAricles = async () => {
      const res = await fetch("http://localhost:8001/api/articles");
      if (!res.ok) {
        return;
      }
      console.log(res);
      const data = await res.json();
      setArticles(data);
    };
    fetchAricles();
  }, []);
  return (
    <div className={styles.publierPage}>
      <h1>Vos Articles</h1>
      {articles ? (
        <Card articles={articles} />
      ) : (
        <div>Pas d'articles pour le moment </div>
      )}
    </div>
  );
}
