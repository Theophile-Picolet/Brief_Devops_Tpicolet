// ici les requêtes
// const allArticles = [
//     {
//         id: 1,
//         title: "Article 1",
//         sub_title: "Sous titre 1",
//         head: "Chapeau 1",
//         body: "corps article 1",
//         published_at: "2025-12-15",
//     },
//     {
//         id: 2,
//         title: "Article 2",
//         sub_title: "Sous titre 2",
//         head: "Chapeau 2",
//         body: "corps article 2",
//         published_at: "2025-11-01",
//     },
//     {
//         id: 3,
//         title: "Article 3",
//         sub_title: "Sous titre 3",
//         article_lead: "Chapeau 3",
//         body: "corps article 3",
//         published_at: "2025-12-17",
//     },
// ];
// import pool f

// export async function getAllArticles(recent: boolean = false, limit?: number) {
//     //  const read = async ()=>{
//         const result = async () =>  await pool.query<Article>(
//           "SELECT * FROM articles ORDER BY published_at DESC"
//         );
//         // return result.rows;

//     let articles = allArticles;
//     console.log("oui dans le get all");
//     // si query "recent" est spécifier
//     if (recent) {
//         articles = articles.sort((a, b) => b.published_at.localeCompare(a.published_at));
//     }
//     // si query "limit" est spécifier
//     if (limit) {
//         articles = articles.slice(0, limit);
//     }

//     // Retourner uniquement les champs id, title, head, published_at
//     return articles.map((article) => ({
//         id: article.id,
//         title: article.title,
//         head: article.head,
//         published_at: article.published_at,
//     }));
// }

// export async function getArticleById(id: number) {
//     // return { id: 1, title: "Article 1" };
//     return allArticles[id - 1];
// }
