import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Card from "./card";

// Mock de useRouter (obligatoire car le composant l'utilise)
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockArticle = {
  title: "Titre de test",
  sub_title: "Sous-titre de test",
  article_lead: "Chapeau de test",
  body: "Contenu de test",
  categorie: "Catégorie de test",
  published_at: "2024-04-01T10:00:00",
};

describe("Card component", () => {
  it("affiche le titre de l'article", () => {
    const { getByText } = render(<Card articles={[mockArticle]} />);
    expect(getByText("Titre de test")).toBeInTheDocument();
  });
});
