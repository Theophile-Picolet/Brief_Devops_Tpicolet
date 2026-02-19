import { useRouter } from "next/navigation";
import styles from "./card.module.css";

type Article = {
  title: string;
  sub_title: string;
  article_lead: string;
  body: string;
  categorie: string;
  published_at: string;
};

interface CardProps {
  articles: Article[];
}

export default function Card({ articles }: CardProps) {
  const router = useRouter();
  return (
    <section>
      <div className={styles.containerArticles}>
        {articles.map((x) => (
          <div key={x.title} className={styles.card}>
            <div className={styles.image}></div>
            <div className={styles.cardText}>
              <h3> {x.title}</h3>
              <h4 key={x.sub_title}>{x.sub_title}</h4>
              <div key={x.categorie}>{x.categorie}</div>
              <div key={x.article_lead}>{x.article_lead}</div>
              <p key={x.body}>{x.body}</p>
              <div key={x.published_at}>{x.published_at}</div>
            </div>

            {/* <button onClick={() => OneArticlePage(x.title)}> voir </button> */}
            <button
              type="button"
              onClick={() =>
                router.push(`/articles/${encodeURIComponent(x.title)}`)
              }
            >
              VOIR
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
