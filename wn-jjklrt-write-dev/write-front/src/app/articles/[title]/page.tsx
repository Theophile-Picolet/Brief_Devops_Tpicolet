// import { useEffect } from "react";
import styles from "./pageArticle.module.css";

type Article = {
  title: string;
  sub_title: string;
  article_lead: string;
  body: string;
  categorie: string;
  published_at: string;
};

export default async function OneArticlePage({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  console.log("params =", params);
  const { title } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${encodeURIComponent(title)}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return <div>Article introuvable</div>;
  }

  const article: Article = await res.json();

  return (
    <section className={styles.containerAritcle}>
      <h1 className={styles.title}>Article</h1>
      <div className={styles.cardArticle}>
        <div className={styles.image}></div>
        <div className={styles.articleText}>
          <h2>{article.title}</h2>
          <h3>{article.sub_title}</h3>
          <p>{article.categorie}</p>
          <p>{article.article_lead}</p>
          <p>{article.body}</p>
          <small>{article.published_at}</small>
        </div>
      </div>
      {/* </div> */}
    </section>
  );
}
