"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Card from "@/components/articles/card";

type Article = {
  title: string;
  sub_title: string;
  article_lead: string;
  body: string;
  categorie: string;
  published_at: string;
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

export default function DeleteArticle() {
  const [lookup, setLookup] = useState("");
  const [article, setArticle] = useState<Article | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /** Chargement de l'article */
  const load = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookup.trim()) return;

    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const res = await fetch(
        `${API}/api/articles/${encodeURIComponent(lookup.trim())}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Article introuvable.");

      const data: Article = await res.json();
      setArticle(data);
      setInfo(`Article chargé (${new Date(data.published_at).toLocaleString()})`);
    } catch (err: any) {
      setArticle(null);
      setError(err?.message ?? "Article introuvable.");
    } finally {
      setLoading(false);
    }
  };

  /** Suppression de l'article */
  const remove = async () => {
    if (!article) return;

    const confirmed = window.confirm(
    `⚠️SUPPRESSION LOGIQUE:\n
    L'article "${article.title}" sera retiré de l'affichage public mais restera en base de données.\n
    Souhaitez vous continuer ?`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    setInfo(null);

    try {
      const res = await fetch(
        // `${API}/api/articles/${encodeURIComponent(article.title)}`,
        `${API}/api/articles/${encodeURIComponent(article.title)}/soft-delete`, // soft-delete pour mise en archive
        { method: "DELETE" }
      );

      const body = await res.json().catch(() => ({}));
      // const body = await res.json();

      if (!res.ok)
        throw new Error(
          body.message || body.error || "Erreur lors de la mise en archive ❌."
        );

      setArticle(null);
      setLookup("");
      setInfo("Article archivé avec succès ✅.");
    } catch (err: any) {
      setError(err?.message ?? "Erreur lors de la mise en archive ❌.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.deletePage}>
      <h1>Archiver un article</h1>

      {/* Recherche */}
      <form className={styles.card} onSubmit={load}>
        <label htmlFor="lookup">Titre exact de l&apos;article</label>
        <div className={styles.inline}>
          <input
            id="lookup"
            value={lookup}
            onChange={(e) => setLookup(e.target.value)}
            placeholder="Titre actuel"
            required
          />
          <button type="submit" disabled={loading} className={styles.chargerButton}>
            {loading ? "Chargement..." : "Charger"}
          </button>
        </div>

        {info && <p className={styles.status}>{info}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>

      {/* Aperçu */}
      {article && (
        <section className={styles.containerArticle}>
          <h2>Aperçu de l&apos;article</h2>

          <div className={styles.cardArticle}>
            <div className={styles.image}></div>
            <div className={styles.articleText}>
              <h3>{article.title}</h3>
              <h4>{article.sub_title}</h4>
              <p>{article.article_lead}</p>
              <p>{article.body}</p>
              <p>{article.categorie}</p>
              <small>{new Date(article.published_at).toLocaleString()}</small>
            </div>
          </div>

          <button
            className={styles.deleteButton}
            onClick={remove}
            disabled={deleting}
          >
            {deleting ? "Archivage..." : "Archiver l'article"}
          </button>
        </section>
      )}
    </div>
  );
}
