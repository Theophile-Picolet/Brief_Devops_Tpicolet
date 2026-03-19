"use client";

import { useState } from "react";
import styles from "./publier.module.css";

// Fonction de slugification
function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function publier() {
  const categories: string[] = [
    "International",
    "Actualités locales",
    "Économie",
    "Sciences et technologies",
    "Divertissement",
    "Sports",
    "Santé",
  ];

  const initialForm = {
    title: "",
    sub_title: "",
    article_lead: "",
    body: "",
    categorie: categories[0] ?? "International",
  };

  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);
    try {
      // Slugifier le titre avant envoi
      const formToSend = { ...form, title: slugify(form.title) };
      const res = await fetch("http://localhost:8001/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formToSend),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrors(data?.errors ?? [data?.error ?? "Erreur inconnue"]);
        return;
      }
      setSuccess(true);
      setForm(initialForm);
    } catch {
      setErrors(["Erreur r\u00e9seau ou serveur."]);
    }
  };

  return (
    <div className={styles.publierForm}>
      <h1>Publier un article</h1>
      <form onSubmit={handleSubmit}>
        <p>
          Veuillez remplir le formulaire ci-dessous avec tous les champs requis
          pour publier un article.
        </p>
        <label htmlFor="titre">Titre de l'article</label>
        <input
          id="titre"
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          maxLength={300}
          required
        />
        <label htmlFor="sous_titre">Sous-titre de l'article</label>
        <input
          id="sous_titre"
          name="sub_title"
          placeholder="Sous-titre"
          value={form.sub_title}
          onChange={handleChange}
          maxLength={300}
          required
        />

        <label htmlFor="chapeau">Chapeau de l'article</label>
        <textarea
          id="chapeau"
          name="article_lead"
          placeholder="Chapeau"
          value={form.article_lead}
          onChange={handleChange}
          maxLength={1000}
          required
        />

        <label htmlFor="categorie">Catégorie</label>
        <select
          id="categorie"
          name="categorie"
          value={form.categorie}
          onChange={handleChange}
          required
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label htmlFor="contenu">Contenu de l'article</label>
        <textarea
          id="contenu"
          name="body"
          placeholder="Corps de l'article"
          value={form.body}
          onChange={handleChange}
          maxLength={10000}
          required
        />
        <button type="submit">ENVOYER</button>
        {errors.length > 0 && (
          <ul className={`${styles.error} ${styles.message}`}>
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        {success && (
          <p className={`${styles.success} ${styles.message}`}>
            Article publié avec succès !
          </p>
        )}
      </form>
    </div>
  );
}
