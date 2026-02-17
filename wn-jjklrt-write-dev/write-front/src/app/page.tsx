import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to World News</h1>
        <p className={styles.description}>
          Stay updated with the latest world news from reliable sources.
        </p>
      </main>
    </div>
  );
}
