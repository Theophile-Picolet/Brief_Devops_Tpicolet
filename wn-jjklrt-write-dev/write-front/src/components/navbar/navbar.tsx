// je souhaite créer une navbar verticale sur le coté gauche de mon application avec les éléments suivants :
//  - articles ( qui est la page principale et qui redirige vers / avec tous les articles affficés)
//  - Rechercher( qui redirige vers une page de recherche avec un input de recherche)
//  - Ajouter ( qui redirige vers une page d'ajout d'article avec un formulaire)
//  - Modifier ( qui redirige vers une page de modification d'article avec un formulaire)
//  - Supprimer ( qui redirige vers une page de suppression d'article avec un formulaire)
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <a href="/articles">Articles</a>
        </li>
        {/* <li className={styles.navItem}>
          <a href="/search">Rechercher</a>
        </li> */}
        <li className={styles.navItem}>
          <a href="/publier">Ajouter</a>
        </li>
        <li className={styles.navItem}>
          <a href="/edit">Modifier</a>
        </li>
        <li className={styles.navItem}>
          <a href="/delete">Supprimer</a>
        </li>
      </ul>
    </nav>
  );
}