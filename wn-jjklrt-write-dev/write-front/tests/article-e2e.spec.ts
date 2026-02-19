import { expect, test } from "@playwright/test";

// Génère un titre unique à chaque exécution
const uniqueTitle = `Article Playwright ${Date.now()}`;

// Fonction de slugification (doit matcher celle du front)
function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Fonction de déslugification pour l'affichage
function deslugify(str) {
  return str.replace(/-/g, " ").replace(/^\w|\s\w/g, (m) => m.toUpperCase());
}

test("Créer un nouvel article", async ({ page }) => {
  await page.goto("http://localhost:3001/publier");
  await page.fill('input[name="title"]', uniqueTitle);
  await page.fill('input[name="sub_title"]', "Sous-titre Playwright");
  await page.fill('textarea[name="article_lead"]', "Chapeau Playwright");
  await page.fill('textarea[name="body"]', "Contenu de test Playwright");
  // Sélection de la catégorie si besoin
  // await page.selectOption('select[name="categorie"]', 'International');
  await page.click('button[type="submit"]');
  // Attendre que le message de succès apparaisse (utilise le texte car les classes CSS sont modulaires)
  await expect(page.locator("text=Article publié avec succès !")).toBeVisible({
    timeout: 10000,
  });
  console.log("✅ Article créé avec succès");
});

test("Éditer un article existant", async ({ page }) => {
  await page.goto("http://localhost:3001/edit");
  // Saisir le titre exact de l'article à éditer (non slugifié, le front le slugifiera)
  await page.fill('input[name="lookup"]', uniqueTitle);
  await page.click('button:has-text("Charger")');
  // Attendre que le formulaire d'édition apparaisse (le champ titre avec la valeur deslugifiée)
  await expect(page.locator('input[name="title"]')).toBeVisible({
    timeout: 10000,
  });
  await expect(page.locator('input[name="title"]')).toHaveValue(
    deslugify(slugify(uniqueTitle)),
  );
  console.log("✅ Article chargé pour édition");
  // Modifier le sous-titre et le corps (pas le titre)
  await page.fill('input[name="sub_title"]', "Sous-titre modifié Playwright");
  await page.fill('textarea[name="body"]', "Nouveau contenu Playwright");
  // Attendre que le bouton "Enregistrer les modifications" soit cliquable
  const saveButton = page.locator(
    'button:has-text("Enregistrer les modifications")',
  );
  await saveButton.waitFor({ state: "visible", timeout: 5000 });
  await saveButton.click();
  // Attendre le message de confirmation (dernier élément car il y a 2 formulaires)
  await expect(page.locator("text=/Article mis à jour/").last()).toBeVisible({
    timeout: 10000,
  });
  console.log("✅ Article modifié avec succès");
});
