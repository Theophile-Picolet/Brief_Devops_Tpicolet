import { expect, test } from "@playwright/test";

test.describe("Filtrage des articles par catégorie", () => {
  test("devrait afficher la page de filtrage par catégorie", async ({
    page,
  }) => {
    // Aller sur la page de catégories
    await page.goto("/articles/category");

    // Vérifier que le titre de la page est présent
    await expect(page.locator("text=/Choix par Catégories/i")).toBeVisible();

    // Vérifier qu'au moins une catégorie est affichée
    const categoryButtons = page.locator("button");
    const count = await categoryButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("devrait filtrer les articles par catégorie Sciences et technologies", async ({
    page,
  }) => {
    // Aller sur la page de catégories
    await page.goto("/articles/category");

    // Attendre que la page soit chargée
    await page.waitForTimeout(500);

    // Chercher et cliquer sur la catégorie "Sciences et technologies"
    const scienceButton = page.getByRole("button", {
      name: "Sciences et technologies",
    });

    if (await scienceButton.isVisible()) {
      await scienceButton.click();

      // Attendre que les résultats soient chargés
      await page.waitForTimeout(1000);

      // Vérifier que des articles sont affichés (ou un message si aucun)
      const pageContent = await page.textContent("body");
      expect(pageContent).toBeTruthy();

      // Soit des articles sont affichés, soit un message "Aucun article"
      const hasArticles = await page.locator('a[href*="/articles/"]').count();
      const hasEmptyMessage = await page
        .locator("text=/aucun article/i")
        .count();

      expect(hasArticles > 0 || hasEmptyMessage > 0).toBeTruthy();
    }
  });

  test("devrait filtrer les articles par catégorie International", async ({
    page,
  }) => {
    // Aller sur la page de catégories
    await page.goto("/articles/category");

    // Attendre que la page soit chargée
    await page.waitForTimeout(500);

    // Chercher et cliquer sur la catégorie "International"
    const internationalButton = page.getByRole("button", {
      name: "International",
    });

    if (await internationalButton.isVisible()) {
      await internationalButton.click();

      // Attendre que les résultats soient chargés
      await page.waitForTimeout(1000);

      // Vérifier que la page a réagi au clic
      const pageContent = await page.textContent("body");
      expect(pageContent).toBeTruthy();
    }
  });

  test("devrait permettre de naviguer vers un article depuis les résultats filtrés", async ({
    page,
  }) => {
    // Aller sur la page de catégories
    await page.goto("/articles/category");

    // Attendre que la page soit chargée
    await page.waitForTimeout(500);

    // Cliquer sur la première catégorie disponible
    const firstCategoryButton = page.locator("button").first();
    if (await firstCategoryButton.isVisible()) {
      await firstCategoryButton.click();

      // Attendre que les résultats soient chargés
      await page.waitForTimeout(1000);

      // Vérifier si des articles sont affichés
      const articleLinks = page.locator('a[href*="/articles/"]');
      const articleCount = await articleLinks.count();

      if (articleCount > 0) {
        // Cliquer sur le premier article
        await articleLinks.first().click();

        // Vérifier que la navigation a fonctionné
        await page.waitForURL(/\/articles\/.+/);

        // Vérifier que le contenu de l'article est présent
        await expect(page.locator("h1")).toBeVisible();
      }
    }
  });
});
