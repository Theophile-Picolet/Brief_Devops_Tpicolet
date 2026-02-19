import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests", // Ne lance que les tests E2E dans ce dossier
  /* Autres options utiles :
  timeout: 30000,
  retries: 0,
  reporter: 'list',
  */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
