import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Edit from "./page";

describe("Edit component", () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("affiche le message d'erreur si l'article n'est pas trouvé", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    render(<Edit />);
    const titreInput = screen.getByLabelText("Titre exact de l'article");
    await userEvent.type(titreInput, "Inexistant");
    expect(titreInput).toHaveValue("Inexistant");
    await userEvent.click(screen.getByText("Charger"));
    await waitFor(() => {
      expect(screen.getByText(/Article introuvable/i)).toBeInTheDocument();
    });
  });

  it("affiche le message de succès après modification", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          title: "Titre de test",
          sub_title: "Sous-titre",
          article_lead: "Lead",
          body: "Body",
          categorie: "Catégorie",
          published_at: "2024-04-01T10:00:00",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          title: "Titre de test",
          sub_title: "Sous-titre",
          article_lead: "Lead",
          body: "Body",
          categorie: "Catégorie",
          published_at: "2024-04-01T10:00:00",
        }),
      });
    render(<Edit />);
    const titreInput = screen.getByLabelText("Titre exact de l'article");
    await userEvent.type(titreInput, "Titre de test");
    expect(titreInput).toHaveValue("Titre de test");
    await userEvent.click(screen.getByText("Charger"));
    await waitFor(() => {
      expect(screen.getByLabelText("Titre")).toBeInTheDocument();
    });
    const editTitreInput = screen.getByLabelText("Titre");
    await userEvent.clear(editTitreInput);
    await userEvent.type(editTitreInput, "Titre modifié");
    await userEvent.click(screen.getByText("Enregistrer les modifications"));
    await waitFor(() => {
      expect(screen.getByText(/Article mis à jour/i)).toBeInTheDocument();
    });
  });
});
