"use client";

import { useState } from "react";
import styles from "./page.module.css";

const API = "http://localhost:8001";

// Fonction de slugification
function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
// Fonction de déslugification pour l'affichage
function deslugify(str: string) {
  return str.replace(/-/g, " ").replace(/^\w|\s\w/g, (m) => m.toUpperCase());
}

type Article = {
  title: string;
  sub_title: string;
  article_lead: string;
  body: string;
  categorie: string;
  published_at: string;
};

const json = { "Content-Type": "application/json" };

export default function Edit() {
  const categories: string[] = [
    "International",
    "Actualités locales",
    "Économie",
    "Sciences et technologies",
    "Divertissement",
    "Sports",
    "Santé",
  ];

  const [lookup, setLookup] = useState("");
  const [article, setArticle] = useState<Article | null>(null);
  const [form, setForm] = useState({
    title: "",
    sub_title: "",
    article_lead: "",
    body: "",
    categorie: categories[0] ?? "International",
  });
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookup.trim()) return;
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      // Slugifier la recherche
      const slug = slugify(lookup.trim());
      const res = await fetch(
        `${API}/api/articles/${encodeURIComponent(slug)}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error("Article introuvable.");
      const data: Article = await res.json();
      setArticle(data);
      setForm({
        title: data.title,
        sub_title: data.sub_title,
        article_lead: data.article_lead,
        body: data.body,
        categorie: data.categorie,
      });
      setInfo(
        `Article chargé (${new Date(data.published_at).toLocaleString()})`,
      );
    } catch (err: unknown) {
      setArticle(null);
      setError(err instanceof Error ? err.message : "Article introuvable.");
    } finally {
      setLoading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;
    setSaving(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch(
        `${API}/api/articles/${encodeURIComponent(article.title)}`,
        {
          method: "PUT",
          headers: json,
          body: JSON.stringify(form),
        },
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          body.message ||
            body.error ||
            body.errors?.join(" ") ||
            "Erreur lors de la mise à jour.",
        );
      const updated: Article = body;
      setArticle(updated);
      setInfo(
        `Article mis à jour (${new Date(updated.published_at).toLocaleString()})`,
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la mise à jour.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.editerPage}>
      <h1>Modifier un article</h1>

      <form className={styles.card} onSubmit={load}>
        <label htmlFor="lookup">Titre exact de l&apos;article</label>
        <div className={styles.inline}>
          <input
            id="lookup"
            name="lookup"
            value={lookup}
            onChange={(e) => setLookup(e.target.value)}
            placeholder="Titre actuel"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={styles.chargerButton}
          >
            {loading ? "Chargement..." : "Charger"}
          </button>
        </div>
        {info && <p className={styles.status}>{info}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>

      {article && (
        <form className={styles.card} onSubmit={save}>
          <label htmlFor="title">Titre</label>
          <input
            id="title"
            name="title"
            value={deslugify(form.title)}
            onChange={(e) =>
              setForm((p) => ({ ...p, title: slugify(e.target.value) }))
            }
            maxLength={300}
            required
          />

          <label htmlFor="sub_title">Sous-titre</label>
          <input
            id="sub_title"
            name="sub_title"
            value={form.sub_title}
            onChange={(e) =>
              setForm((p) => ({ ...p, sub_title: e.target.value }))
            }
            maxLength={300}
            required
          />

          <label htmlFor="article_lead">Chapeau</label>
          <textarea
            id="article_lead"
            name="article_lead"
            value={form.article_lead}
            onChange={(e) =>
              setForm((p) => ({ ...p, article_lead: e.target.value }))
            }
            maxLength={1000}
            required
          />

          <label htmlFor="body">Corps</label>
          <textarea
            id="body"
            name="body"
            value={form.body}
            onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
            maxLength={10000}
            required
          />

          <label htmlFor="categorie">Catégorie</label>
          <select
            id="categorie"
            name="categorie"
            value={form.categorie}
            onChange={(e) =>
              setForm((p) => ({ ...p, categorie: e.target.value }))
            }
            required
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {info && <p className={styles.status}>{info}</p>}
          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      )}
    </div>
  );
}
