import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Comments from "../Comments";

// Mock de fetch
global.fetch = jest.fn();

describe("Comments component", () => {
  const mockComments = [
    {
      id: 1,
      description: "Premier commentaire de test",
      created_at: "2024-04-01T10:00:00Z",
    },
    {
      id: 2,
      description: "Deuxième commentaire de test",
      created_at: "2024-04-02T11:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("affiche un message de chargement initialement", () => {
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves
        }),
    );

    render(<Comments articleTitle="test-article" />);
    expect(
      screen.getByText("Chargement des commentaires..."),
    ).toBeInTheDocument();
  });

  it("affiche les commentaires après chargement", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockComments,
    });

    render(<Comments articleTitle="test-article" />);

    await waitFor(() => {
      expect(screen.getByText("Commentaires")).toBeInTheDocument();
    });

    expect(screen.getByText("Premier commentaire de test")).toBeInTheDocument();
    expect(
      screen.getByText("Deuxième commentaire de test"),
    ).toBeInTheDocument();
  });

  it("affiche un message quand il n'y a aucun commentaire", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Comments articleTitle="test-article" />);

    await waitFor(() => {
      expect(
        screen.getByText("Aucun commentaire pour cet article."),
      ).toBeInTheDocument();
    });
  });

  it("affiche un message d'erreur en cas d'échec du chargement", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    });

    render(<Comments articleTitle="test-article" />);

    await waitFor(() => {
      expect(screen.getByText(/Erreur/)).toBeInTheDocument();
    });
  });

  it("utilise l'URL correcte avec le titre d'article encodé", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Comments articleTitle="article-avec-tirets" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8002/api/articles/article-avec-tirets/comments",
      );
    });
  });

  it("encode correctement les titres avec espaces", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Comments articleTitle="article avec espaces" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8002/api/articles/article%20avec%20espaces/comments",
      );
    });
  });
});
