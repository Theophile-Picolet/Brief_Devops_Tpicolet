import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddCommentButton from "../AddCommentButton";

// Mock de fetch
global.fetch = jest.fn();

describe("AddCommentButton component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("affiche le bouton d'ajout de commentaire", () => {
    render(<AddCommentButton articleTitle="test-article" />);
    expect(screen.getByText("Ajouter un commentaire")).toBeInTheDocument();
  });

  it("ouvre la modale au clic sur le bouton", () => {
    render(<AddCommentButton articleTitle="test-article" />);

    const button = screen.getByText("Ajouter un commentaire");
    fireEvent.click(button);

    expect(
      screen.getByPlaceholderText(/Votre commentaire/i),
    ).toBeInTheDocument();
  });

  it("ferme la modale au clic sur le bouton de fermeture", () => {
    render(<AddCommentButton articleTitle="test-article" />);

    // Ouvrir la modale
    fireEvent.click(screen.getByText("Ajouter un commentaire"));
    expect(
      screen.getByPlaceholderText(/Votre commentaire/i),
    ).toBeInTheDocument();

    // Fermer la modale avec le bouton ×
    const closeButton = screen.getByLabelText("Fermer");
    fireEvent.click(closeButton);

    // La modale ne devrait plus être visible
    expect(
      screen.queryByPlaceholderText(/Votre commentaire/i),
    ).not.toBeInTheDocument();
  });

  it("vérifie que le textarea a les bonnes contraintes de validation", () => {
    render(<AddCommentButton articleTitle="test-article" />);

    // Ouvrir la modale
    fireEvent.click(screen.getByText("Ajouter un commentaire"));

    // Vérifier les attributs du textarea
    const textarea = screen.getByPlaceholderText(/Votre commentaire/i);
    expect(textarea).toHaveAttribute("required");
    expect(textarea).toHaveAttribute("maxLength", "1000");
  });

  it("appelle fetch avec les bonnes données lors de la soumission", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, description: "Test comment" }),
      headers: new Map(),
    });

    render(<AddCommentButton articleTitle="test-article" />);

    // Ouvrir la modale
    fireEvent.click(screen.getByText("Ajouter un commentaire"));

    // Saisir le commentaire
    const textarea = screen.getByPlaceholderText(/Votre commentaire/i);
    fireEvent.change(textarea, {
      target: { value: "Mon commentaire de test" },
    });

    // Soumettre
    const submitButton = screen.getByText("Ajouter le commentaire");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8002/api/articles/test-article/comments",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: "Mon commentaire de test" }),
        }),
      );
    });
  });

  it("affiche le loader pendant l'envoi", async () => {
    // Mock fetch qui met du temps à répondre
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({ id: 1 }),
              headers: new Map(),
            });
          }, 100);
        }),
    );

    render(<AddCommentButton articleTitle="test-article" />);

    // Ouvrir et soumettre
    fireEvent.click(screen.getByText("Ajouter un commentaire"));
    const textarea = screen.getByPlaceholderText(/Votre commentaire/i);
    fireEvent.change(textarea, { target: { value: "Test" } });
    fireEvent.click(screen.getByText("Ajouter le commentaire"));

    // Vérifier que le texte du bouton change pendant le chargement
    await waitFor(() => {
      expect(screen.getByText("Envoi en cours...")).toBeInTheDocument();
    });
  });

  it("ferme la modale après succès", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 }),
      headers: new Map(),
    });

    render(<AddCommentButton articleTitle="test-article" />);

    // Ouvrir et soumettre
    fireEvent.click(screen.getByText("Ajouter un commentaire"));
    const textarea = screen.getByPlaceholderText(/Votre commentaire/i);
    fireEvent.change(textarea, { target: { value: "Test" } });
    fireEvent.click(screen.getByText("Ajouter le commentaire"));

    // Attendre que la modale se ferme
    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText(/Votre commentaire/i),
      ).not.toBeInTheDocument();
    });
  });
});
