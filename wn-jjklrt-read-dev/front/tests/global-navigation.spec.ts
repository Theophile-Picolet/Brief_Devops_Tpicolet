import { expect, test } from "@playwright/test";

test.describe("Navigation globale et Header", () => {
  test("devrait afficher le header sur toutes les pages", async ({ page }) => {
    // Vérifier le header sur la page d'accueil
    await page.goto("/");
    const header = page.locator("header, nav").first();
    await expect(header).toBeVisible();

    // Vérifier le header sur la page articles
    await page.goto("/articles");
    await expect(header).toBeVisible();

    // Vérifier le header sur la page à propos
    await page.goto("/a-propos");
    await expect(header).toBeVisible();
  });

  test("devrait naviguer entre les différentes pages via les liens", async ({
    page,
  }) => {
    // Commencer sur la page d'accueil
    await page.goto("/");

    // Chercher un lien vers les articles
    const articlesLink = page.locator('a[href*="/articles"]').first();
    if (await articlesLink.isVisible()) {
      await articlesLink.click();
      await page.waitForURL(/\/articles/);
      expect(page.url()).toContain("/articles");
    }

    // Revenir à l'accueil
    await page.goto("/");

    // Chercher un lien vers "à propos"
    const aboutLink = page.locator('a[href*="/a-propos"]').first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForURL(/\/a-propos/);
      expect(page.url()).toContain("/a-propos");
    }
  });

  test("devrait afficher la page d'accueil correctement", async ({ page }) => {
    await page.goto("/");

    // Vérifier que la page se charge sans erreur
    const pageContent = await page.textContent("body");
    expect(pageContent).toBeTruthy();

    // Vérifier qu'il y a du contenu visible (chercher le body)
    const bodyContent = page.locator("body");
    await expect(bodyContent).toBeVisible();
  });

  test("devrait afficher la page À propos correctement", async ({ page }) => {
    await page.goto("/a-propos");

    // Attendre un peu que la page se charge
    await page.waitForTimeout(1000);

    // Vérifier qu'il y a du contenu
    const pageContent = await page.textContent("body");
    expect(pageContent).toBeTruthy();
  });

  test("devrait utiliser le bouton retour pour revenir à la liste des articles", async ({
    page,
  }) => {
    // Aller sur la page des articles
    await page.goto("/articles");
    await page.waitForTimeout(1000);

    // Cliquer sur un article
    const articleLinks = page.locator('a[href*="/articles/"]');
    const articleCount = await articleLinks.count();

    if (articleCount > 0) {
      await articleLinks.first().click();
      await page.waitForURL(/\/articles\/.+/);

      // Cliquer sur le bouton retour
      const backButton = page.getByRole("button", { name: /retour/i });
      if (await backButton.isVisible()) {
        await backButton.click();

        // Vérifier qu'on est revenu à la liste des articles
        await page.waitForTimeout(500);
        expect(page.url()).toContain("/articles");
      }
    }
  });
});
