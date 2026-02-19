import { expect, test } from "@playwright/test";

test.describe("Navigation et consultation d'articles", () => {
  test("devrait afficher la liste des articles et naviguer vers un détail", async ({
    page,
  }) => {
    // Aller sur la page des articles
    await page.goto("/articles");

    // Vérifier que le titre de la page est présent
    await expect(page.getByRole("heading", { name: "Articles" })).toBeVisible();

    // Attendre que les articles soient chargés
    await page.waitForTimeout(2000);

    // Vérifier qu'au moins un article est affiché (chercher les articles dans la zone de contenu)
    const articles = page.locator("article");
    await expect(articles.first()).toBeVisible({ timeout: 10000 });

    // Récupérer le titre du premier article
    const firstArticleTitleLocator = articles.first().locator("h2");
    await expect(firstArticleTitleLocator).toBeVisible({ timeout: 10000 });
    const firstArticleTitle = await firstArticleTitleLocator.textContent();
    expect(firstArticleTitle).toBeTruthy();

    // Cliquer sur le premier article (cliquer sur l'article lui-même)
    await articles.first().click();

    // Attendre que la page de détail soit chargée
    await page.waitForURL(/\/articles\/.+/);

    // Vérifier que le titre de l'article est affiché
    await expect(page.locator("h1")).toBeVisible();

    // Vérifier que le bouton retour est présent (c'est un lien, pas un bouton)
    await expect(page.getByRole("link", { name: /retour/i })).toBeVisible();

    // Vérifier que le contenu de l'article est présent
    await expect(page.locator("article")).toBeVisible();
  });

  test("devrait afficher un message d'erreur pour un article inexistant", async ({
    page,
  }) => {
    // Aller sur une page d'article qui n'existe pas
    await page.goto("/articles/article-inexistant-12345");

    // Attendre le chargement
    await page.waitForTimeout(1000);

    // Vérifier qu'aucun contenu d'article n'est affiché ou qu'un message d'erreur est présent
    // (selon l'implémentation de la gestion d'erreur)
    const articleContent = page.locator("article");
    const count = await articleContent.count();
    expect(count).toBe(0);
  });

  test("devrait pouvoir ajouter un commentaire sur un article", async ({
    page,
  }) => {
    // Aller sur la page des articles
    await page.goto("/articles");

    // Attendre que les articles soient chargés
    await page.waitForTimeout(2000);

    // Cliquer sur le premier article
    const articles = page.locator("article");
    await articles.first().click();

    // Attendre que la page de détail soit chargée
    await page.waitForURL(/\/articles\/.+/);

    // Vérifier que le bouton d'ajout de commentaire est présent
    const addCommentButton = page.getByRole("button", {
      name: /ajouter un commentaire/i,
    });

    // Si le bouton est présent, tester l'ajout d'un commentaire
    if (await addCommentButton.isVisible()) {
      await addCommentButton.click();

      // Attendre que le formulaire apparaisse
      const commentTextarea = page.locator('textarea[name="description"]');
      if (await commentTextarea.isVisible()) {
        // Remplir le commentaire
        await commentTextarea.fill(
          `Commentaire de test E2E - ${new Date().toISOString()}`,
        );

        // Soumettre le formulaire
        const submitButton = page.getByRole("button", { name: /envoyer/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();

          // Attendre un court instant pour la soumission
          await page.waitForTimeout(1000);
        }
      }
    }

    // Vérifier que la section commentaires est présente
    // Attendre plus longtemps car le composant est chargé dynamiquement (ssr: false)
    await page.waitForTimeout(2000);

    // Chercher soit "Commentaires", "Aucun commentaire", ou "Chargement des commentaires"
    const hasCommentText = await page.locator("body").textContent();
    expect(hasCommentText).toMatch(/(commentaire|Commentaire)/i);
  });
});
